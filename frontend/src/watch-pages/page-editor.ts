// `<wa-page-editor>`: the watch's pages as Home Assistant keeps them, and an
// editor for them.
//
// Part 3a drew them: the watch tabs, the page list, one page at the watch's
// own size, where the stored copy has got to, and the earlier saves with a way
// to put one back. Part 3b edits them: pages are added, renamed, hidden,
// moved and deleted, and tiles are moved, swapped, resized and deleted on the
// page, with undo, redo and a save that merges when another save landed too. A
// watch with no pages record yet gets one from "Start with an empty page"
// (4e).
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
  type ComplicationRecord,
  type HassEntityState,
  type HassLike,
  type OwnerSummary,
  type WatchConfigHistoryEntry,
  type WatchConfigRecord,
  fetchCloudStatus,
  fetchConfigEntries,
  fetchList,
  fetchOwners,
  fetchHttpActions,
  fetchWatchConfig,
  fetchWatchConfigHistory,
  fetchWatchConfigHistoryEntry,
  renderTemplates,
  restoreWatchConfig,
  saveRecord,
  saveWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import {
  clearPageFromComplication,
  clearPageFromMenus,
  complicationsOpeningPage,
  deletedPageIds,
  menuSlotsOpeningPage,
} from "./page-refs.js";
import {
  MUSIC_ASSISTANT_DOMAIN,
  WATCH_TEMPLATE_DEBOUNCE_MS,
  WATCH_TEMPLATE_REFRESH_MS,
  type WatchHomeData,
  type WatchTemplateRender,
  watchCloudTTSAvailable,
  watchHasConfigEntry,
  watchMergedRenders,
  watchSaveSpeakerWarning,
  watchTemplateRequests,
  watchTemplateSignature,
} from "./app-model.js";
import { appSettingsStyles } from "./app-settings.js";
import { SCRUB_END, SCRUB_START } from "../editors.js";
import { type ColumnWidths, beginColumnDrag, fitColumnWidths, loadColumnWidths, saveColumnWidths } from "../column-split.js";
import {
  canvasStyles,
  chromeTokens,
  columnStyles,
  inspectorStyles,
  leftCardStyles,
  rowListStyles,
  topBarStyles,
} from "../editor-chrome.js";
import { formStyles, rangeFill } from "../form-styles.js";
import { SECTION_COLOR } from "../kinds.js";
import { peopleOf } from "../people.js";
import { personColorVar } from "../pickerRows.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { agoWords } from "../send-state.js";
import { SymbolBrowser } from "../symbols.js";
import { type TestControl, testControlFor } from "../test-controls.js";
import { uiIcon } from "../ui-icons.js";
import {
  PAGES_NO_RECORD_TEXT,
  PAGES_START_BUTTON,
  PAGES_START_CONFLICT_TEXT,
  PAGES_UNREADABLE_TEXT,
  PAIR_FIRST_TEXT,
  START_FRESH_BUTTON,
  type NoRecordStart,
  deliveryState,
  followWatch,
  mayStart,
  noRecordStart,
  noRecordText,
  settingsWatches,
  watchAppDevices,
  watchName,
  watchRecordUnreadable,
} from "../watch-settings.js";
import { isPhoneId } from "../phone-pages.js";
import { type PhoneCopyScope, copyToPhone, phoneCopyNote, phoneCopyReach } from "../phone-copy.js";
import { type RoomsKind, roomsKindFor } from "../watch-rooms/model.js";
import { addTileStyles, renderAddTile } from "./add-tile.js";
import {
  SavedAgoTicker,
  configFootStatus,
  configFootStyles,
  copyConfigText,
  openConfigDialogs,
  renderConfigFoot,
  renderConfigHistoryDialog,
  renderConfigRawDialog,
  renderConfigSaved,
} from "./config-foot.js";
import {
  type WatchCatalog,
  type WatchCatalogVoice,
  watchCatalogEventIsNews,
  watchCatalogFromRecord,
  watchCatalogReadMeansNone,
  watchCatalogWithStatusPages,
  watchStatusPagesFromRecord,
} from "./catalog.js";
import { type WatchHttpLibrary, readWatchHttpLibrary, watchCatalogWithHttpLibrary, watchHttpLibraryReadMeansNone } from "./http-library.js";
import { voiceDocumentOfRecord, watchVoiceFallbacks } from "../watch-voice/defaults.js";
import { type WatchPagesApplyOptions, type WatchPagesDraft, type WatchPagesSaveResult, createWatchPages, saveWatchPagesDraft } from "./draft.js";
import { type AddTileHost, type TileSettingsHost, type WatchPagesEditorHost, NO_ICONS, ScrubRun, extendHost, memoIconNames, watchKeysTypeText } from "./editor-host.js";
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
  canMoveWatchTilesBy,
  deleteWatchPage,
  deleteWatchTile,
  dropWatchTile,
  findWatchPage,
  listedWatchPages,
  moveWatchPage,
  moveWatchTilesBy,
  nudgeWatchTile,
  previewWatchTileResize,
  randomWatchId,
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
import { WATCH_PAGES_HELP_URL, navigateMenusFromPages, navigateWatchPages, registerWatchPagesDrafts } from "./hook.js";
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
  WATCH_GRID_COLUMNS,
  WATCH_GRID_TOP_INSET,
  WATCH_PAGES_LIMIT_BYTES,
  asWatchPagesDocument,
  isHiddenWatchPage,
  isJsonObject,
  isSmartWatchPage,
  isVirtualTileKind,
  sizeOf,
  tileEntityId,
  tileKind,
  tileKindLabel,
  tileLabel,
  watchPageExtent,
  watchPageHasHeader,
  watchPageId,
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
  watchPreviewTileLabel,
  renderWatchPageTitle,
  watchScreenColor,
  watchScreenLayers,
  watchTileSymbol,
} from "./preview.js";
import { PagePhotoStore } from "./page-photo-store.js";
import { addWatchTile, watchAddRefusal, watchAddThemeOf, watchKindColor } from "./tile-new.js";
import { renderWatchClock, watchPreviewLayout, watchTileCornerRadius } from "./preview.js";
import { renderWatchFrame, watchFrameStyles } from "../watch-frame.js";
import { type WatchPagesNote, watchCommandError, watchPagesSaveNote } from "./save-note.js";
import {
  forgetTileSettingsNotes,
  renderTileName,
  renderTileSettings,
  tileInspectorSections,
  tileSettingsFoldIds,
  tileSettingsStyles,
} from "./tile-settings.js";
import { type WatchGroupActions, renderPickedGroupCard, renderTileGroupLine } from "./group-settings.js";
import {
  WATCH_PAGE_CHIP_COLOR,
  WATCH_PAGE_CHIP_LABELS,
  WATCH_PAGE_SECTION_BADGES,
  WATCH_PAGE_SECTION_TITLES,
  type WatchPageStripSection,
  pageSettingSummary,
  pageSettingsStyles,
  renderPageReset,
  renderPageSettingBody,
  watchPageSectionChanged,
  watchPageThemeDot,
} from "./page-settings.js";
import { watchPageSettings } from "./page-settings-model.js";
import { type WatchSectionBadge, watchTileKindColor } from "./tile-settings-options.js";
import { type FoldId, anySectionOpen, setSectionsOpen } from "./fold-memory.js";
import { specialSettingsStyles } from "./special-settings.js";
import { watchCameraRefreshDefaults, watchDeviceSiblings, watchObjectName } from "./special-model.js";
import { readSmartConfig, resolveSmartPagesBeforeSave } from "./smart-model.js";
import {
  SMART_SECTION_BADGE,
  renderSmartPageBody,
  renderSmartPageSwitch,
  renderSmartRulesCard,
  smartFoldIds,
  smartRuleCountWords,
  smartSelectedRuleIndex,
  smartSettingsStyles,
  smartStageFacts,
} from "./smart-settings.js";
import { scrubWatchOrphanTriggers } from "./tile-settings-model.js";
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
  loadStageLive,
  nearestCell,
  pastDragThreshold,
  loadStageZoom,
  rowsOnScreen,
  saveStageLive,
  saveStageZoom,
  stageFitZoom,
  stageGrid,
  stageRows,
  stageZoomIn,
  stageZoomLabel,
  stageZoomOut,
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

/** How often the view asks whether a device has collected a save. Nothing
 * on the live line says so: it only carries new revisions. */
const DELIVERY_POLL_MS = 15_000;

/** The keys held back while a number is dragged (`onKeyDown`). */
const SCRUB_HELD_KEYS: ReadonlySet<string> = new Set(["Escape", "Delete", "Backspace", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

/** The page list and the cards column, each widened by dragging the gutter
 * beside it, as the complication editor's columns are. */
const PE_COLUMNS = { min: 200, max: 720, middleMin: 320 } as const;
const PE_COLUMNS_DEFAULT: ColumnWidths = { left: 280, right: 320 };
const PE_COLUMNS_KEY = "wrist-assistant-panel.pages.columns.v1";
/** The grid's own cost beside its three columns, CSS px: two 8px gutters and
 * the complication editor's 2px gap on each side of each. The host's padding
 * is outside the width measured. */
const PE_GRID_CHROME = 2 * 8 + 4 * 2;
/** At or below this content width the columns stack and the top bar takes
 * two rows (the `@container` rules on `.layout.pe-layout` say the same). */
const PE_STACK_WIDTH = 820;

/** The row thumbnails' box, CSS px: the complication editor's layer thumbs. */
const THUMB_W = 44;
const THUMB_H = 22;

/** Entity id kinds whose part after the dot is an id of the tile's own
 * (`spacer.<id>`, `template.<id>`): a copy takes a new one. */
const OWN_ID_KINDS: ReadonlySet<string> = new Set(["spacer", "template", "music_hub", "point_control", "multicam"]);

/** Whether a tile draws other icons or colors in some states (`stateIcons`,
 * `stateColors`): the row's "rules" badge. */
function tileHasStateRules(tile: WatchPageTile): boolean {
  const any = (v: unknown) => isJsonObject(v) && Object.keys(v).length > 0;
  return any(tile.stateIcons) || any(tile.stateColors);
}

/** Whether a tile's single tap was set rather than left to its kind: the
 * row's "action" badge. */
function tileHasTapAction(tile: WatchPageTile): boolean {
  return typeof tile.singleTapAction === "string" && tile.singleTapAction !== "";
}

/** Whether a click on a list row came from one of the row's own controls (a
 * button, a field, its open menu) rather than the row itself. Only what lies
 * between the press and the row counts, read from the event's path, so a
 * button or menu somewhere around the list never swallows the row's click,
 * and no `instanceof` check can fail on an element from another realm. */
function pressedRowControl(e: Event): boolean {
  const path = e.composedPath();
  const row = path.indexOf(e.currentTarget as EventTarget);
  for (const node of row < 0 ? [] : path.slice(0, row)) {
    const el = node as Partial<Element>;
    const tag = typeof el.tagName === "string" ? el.tagName.toUpperCase() : "";
    if (tag === "BUTTON" || tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return true;
    if (el.classList?.contains("pe-menu") === true) return true;
  }
  return false;
}

/** The page's tiles in reading order: by row, then by column. */
function tilesInReadingOrder(page: WatchPage): WatchPageTile[] {
  return watchPageTiles(page)
    .map((tile, index) => ({ tile, index, rect: watchTileRect(tile) }))
    .sort((a, b) => a.rect.row - b.rect.row || a.rect.col - b.rect.col || a.index - b.index)
    .map((t) => t.tile);
}

/** A copy of a tile to add to the same page: a new id, out of any group, and
 * a new own id in its entity id for the kinds that carry one. Placed by the
 * add (`addWatchTile`). */
function duplicateOf(tile: WatchPageTile): WatchPageTile {
  const copy = structuredClone(tile) as WatchPageTile;
  copy.id = randomWatchId().toUpperCase();
  delete copy.groupId;
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  if (OWN_ID_KINDS.has(kind) && entityId.includes(".")) copy.entityId = `${kind}.${randomWatchId().toUpperCase()}`;
  return copy;
}

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
  /** Where the device keeps its rooms here (`roomsKindFor`): `behavior` on a
   * watch's main house, its `rooms` record on another home or an iPhone. */
  roomsKind: RoomsKind;
  /** That document, once read, for the room quick jump lines. */
  behavior?: Record<string, unknown>;
  behaviorState: "loading" | "ready" | "none";
  removeLinks: boolean;
  /** The menus document and this watch's complications, once read, for the
   * menu slots and taps that open the page. Either may be missing when it
   * could not be read; `refsState` is then still "ready". */
  menus?: Record<string, unknown>;
  complications?: ComplicationRecord[];
  refsState: "loading" | "ready";
}

/** The Copy from watch question, on an iPhone (`phone-copy.ts`): the watch
 * to copy from, its pages once read, and what to copy, all pages or one
 * page's id. */
interface CopyAsk {
  watch?: string;
  state: "loading" | "ready" | "error";
  pages?: WatchPagesDocument;
  error?: string;
  scope: "all" | string;
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
  /** A pick of several dragged by one of them: every picked tile with its
   * place when the press began, the grabbed one among them. They all move by
   * the grabbed tile's columns and rows, never swap, and go all or nothing
   * (`moveWatchTilesBy`). Absent for a tile dragged alone. */
  group?: { id: string; rect: WatchRect }[];
}

/** How far a drag moves the grabbed tile, in columns and rows: from its
 * place when the press began to the cell it is aimed at. */
function moveDelta(move: MoveGesture, cell: WatchCell): { dcols: number; drows: number } {
  return { dcols: cell.col - move.rect.col, drows: cell.row - move.rect.row };
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

/** Who made a save, in words: the panel writes `panel`, a device the id of
 * the watch's pair, whether the watch or its iPhone sent it. */
function savedBy(updatedBy: string | null | undefined): string {
  return updatedBy === "panel" ? "Saved here" : "From the watch";
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

/** Fields where keys type text: the editor's own keys stay out of them. A
 * slider or a menu is not one, so Cmd+Z there undoes the edit it made
 * (`watchKeysTypeText`). */
function isTextField(node: EventTarget | undefined): boolean {
  if (!(node instanceof HTMLElement)) return false;
  return watchKeysTypeText(node.tagName, node instanceof HTMLInputElement ? node.type : undefined, node.isContentEditable);
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

/** Why an iPhone's page is drawn in a watch's frame. */
export const PHONE_FRAME_TEXT = "The iPhone is drawn in a watch's frame for now.";

/** The stage's frame label on an iPhone: the phone's name, in a watch's
 * frame. */
export function phoneFrameLabel(name: string): string {
  return `${name}, in a watch frame`;
}

/** What an iPhone with no pages says under its title (`phone-pages.ts`). */
export const PHONE_PAGES_EMPTY_TEXT = "Add a page and build it here, or copy pages from one of your watches. Nothing is copied by itself.";

/** How long the edge handles are: four tenths of the side, 8 to 20 pixels,
 * so even a one cell tile shows its handles apart from the corner. */
function handleSizes(box: { width: number; height: number }): string {
  const along = (side: number) => Math.round(Math.max(8, Math.min(20, side * 0.4)));
  return `--pe-hv:${along(box.height)}px;--pe-hh:${along(box.width)}px;`;
}

/** A picture's natural size, loaded as an image (a camera's snapshot, whose
 * `entity_picture` is a tokened path on Home Assistant itself). Undefined
 * when it does not load within 15 seconds. */
function loadImageNaturalSize(url: string): Promise<{ width: number; height: number } | undefined> {
  return new Promise((resolve) => {
    const image = new Image();
    const done = (size: { width: number; height: number } | undefined) => {
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      resolve(size);
    };
    const timer = window.setTimeout(() => done(undefined), 15_000);
    image.onload = () => done(image.naturalWidth > 0 && image.naturalHeight > 0 ? { width: image.naturalWidth, height: image.naturalHeight } : undefined);
    image.onerror = () => done(undefined);
    image.src = url;
  });
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
  /** Loads a picture and reads its natural size, for a camera's ratio
   * detection. The default loads it as an image; the harness and tests
   * stand one in so nothing goes to the network. */
  @property({ attribute: false }) loadImageSize: (url: string) => Promise<{ width: number; height: number } | undefined> = loadImageNaturalSize;
  /** The top bar offers Home Assistant's menu, as the panel's own bar does on
   * a phone or with the sidebar hidden (`hook.ts`). */
  @property({ attribute: false }) haMenu = false;
  @property({ attribute: false }) onHaMenu?: () => void;
  /** Back to the complication editor. Without it, the address less `/pages`. */
  @property({ attribute: false }) onBack?: () => void;
  /** To the menu editor. Without it, the address's `/pages` made `/menus`. */
  @property({ attribute: false }) onMenus?: () => void;
  /** The panel's own buttons for the bar's right end: Watch settings, whose
   * dialog the panel draws. */
  @property({ attribute: false }) barActions: TemplateResult | typeof nothing = nothing;
  /** The panel's Watch app row owns the watch: it picks the watch (this
   * element follows `ownerId` wherever it goes) and holds the ways to the
   * other screens, so the bar leaves out its own watch picker, the way back
   * to complications and Menus. Off, the bar is as it always was. */
  @property({ attribute: false }) shellOwnsWatch = false;
  /** The home keeps phone pages (`phone-pages.ts`): an iPhone is a device
   * this element opens too, on its own pages. Off, it opens watches only. */
  @property({ attribute: false }) phones = false;

  @state() private watchId?: string;
  @state() private record?: WatchConfigRecord;
  /** The iPhone's library (`catalog.ts`) for the watch on screen, undefined
   * while there is none. Kept here and never in the draft: it is read only,
   * never saved, undone or merged. */
  @state() private catalog?: WatchCatalog;
  /** The watch's own status pages record (the `status_pages` kind), read
   * only, for the status page pickers; undefined before the first read and
   * after one that failed. Its revision 0 means none: the pickers then read
   * the iPhone's list. */
  @state() private statusPagesRecord?: { revision: number; document: unknown };
  private statusPagesSeq = 0;
  /** The home's HTTP action library (`http-library.ts`), the same for every
   * watch, read when a watch opens and on a reconnect (it has no live line);
   * undefined before the first read and with an integration older than it. */
  @state() private httpLibrary?: WatchHttpLibrary;
  private httpLibrarySeq = 0;
  private pickerCatalogMemo?: { catalog: WatchCatalog | undefined; record: unknown; library: WatchHttpLibrary | undefined; out: WatchCatalog | undefined };
  /** The watch's camera refresh setting from its behavior document, for the
   * Camera task's Default words; the phone's defaults until it is read. */
  @state() private cameraRefresh: { on: boolean; debounce: string } = watchCameraRefreshDefaults(undefined);
  /** The watch's behavior document as last read, for the Pointer section's
   * read only switches; undefined while there is none or the read failed. */
  @state() private behavior?: Readonly<Record<string, unknown>>;
  private behaviorSeq = 0;
  /** The watch's voice settings document (the `voice` record) as last read,
   * for the voice defaults behind an Assist or Speak tile; undefined while
   * there is none, before the read is in, and after a read that failed. Read
   * only here: the Voice editor writes it. */
  @state() private voiceDocument?: Readonly<Record<string, unknown>>;
  private voiceSeq = 0;
  /** What the element knows of the home beyond its states (part 3f batch
   * 2): asked the first time a watch is opened and again after a reconnect.
   * Each field undefined until in; a failed call keeps what was known. */
  @state() private homeData: WatchHomeData = { musicAssistant: undefined, cloudTTS: undefined };
  private homeDataAsked = false;
  private musicSeq = 0;
  private cloudSeq = 0;
  /** The shown page's template tiles as Home Assistant renders them, by
   * tile id, each with the text it was asked for. Never in the draft;
   * cleared when another watch is opened. */
  @state() private templateRenders: ReadonlyMap<string, WatchTemplateRender> = new Map();
  /** The `(tile id, text)` set last asked about (`watchTemplateSignature`);
   * a draw that finds another one asks again after the debounce. */
  private templateSignature?: string;
  /** Bumped by every render call: an answer that a newer call outran is
   * dropped. */
  private templateRun = 0;
  private templateDebounce?: number;
  private templateInterval?: number;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private history: WatchConfigHistoryEntry[] = [];
  @state() private historyState: HistoryState = "loading";
  @state() private note?: Note;
  @state() private restoreAsk?: RestoreAsk;
  @state() private restoring = false;
  /** "Start with an empty page" is out. */
  @state() private starting = false;
  /** The Copy from watch question is open. */
  @state() private copyAsk?: CopyAsk;
  /** A copy from a watch is out. */
  @state() private copying = false;
  private copySeq = 0;
  /** The panel's list arrives after the panel's first draw. Until it does,
   * the view asks for the devices itself, to tell "none yet" from "not
   * loaded yet". */
  @state() private ownList?: readonly OwnerSummary[];
  private ownListAsked = false;

  @state() private selectedPageId?: string;
  @state() private selectedTileId?: string;
  /** The tiles picked together (Cmd or Ctrl-click, Shift-click, Select all),
   * the complication editor's `multi`: two or more ids on the shown page, with
   * `selectedTileId` among them as the primary (the last one clicked, and the
   * anchor of a Shift range). Empty for a single selection or none. */
  @state() private multi: ReadonlySet<string> = new Set();
  /** The tile whose Tiles row is under the pointer: the stage tints it, as
   * the complication editor tints a layer whose row is pointed at. */
  @state() private rowHoverTileId?: string;
  /** The tile under the pointer on the stage: its Tiles row wears the accent
   * outline (`.layer.peek`), so the list says which tile the pointer is on. */
  @state() private stageHoverTileId?: string;
  /** The page strip's open popover: one section at a time, none when shut. */
  @state() private pageStripOpen?: WatchPageStripSection;
  /** The page the open popover belongs to: once another page is shown (a
   * pick, a delete, an add, a merge that took it away) the popover shuts. */
  private pageStripPageId?: string;
  /** The selected rule of a smart page (`WatchPagesEditorHost.smartRuleId`). */
  @state() private selectedSmartRuleId?: string;
  @state() private renaming?: { pageId: string; value: string };
  /** Not a reactive state: a keystroke needs no draw, the field shows it. */
  private typing?: Typing;
  @state() private menuPageId?: string;
  @state() private deleteAsk?: DeleteAsk;
  /** The save question (part 3f batch 2): Speak or Assist tiles that will
   * fall back to the default speakers. Worked out again at each draw from
   * the draft, so an edit made meanwhile is shown. */
  @state() private saveAsk = false;
  /** Draw the page as the watch does, headers pulling the rows up. Read
   * only. */
  @state() private asOnWatch = false;
  /** Draw the tiles in Home Assistant's real states (the Live switch);
   * off, every tile is drawn lit. Remembered between visits. */
  @state() private liveStates = loadStageLive();
  /** Test states typed or picked in the Live strip, entity id to state: the
   * previews draw as if Home Assistant said so, Live or all on. Never saved,
   * not part of undo, dropped with another watch. */
  @state() private testStates = new Map<string, string>();
  /** The state chip the pointer rests on (or that holds focus) in the Live
   * strip: the previews draw its entity in that state, over any pinned test
   * state, until the pointer leaves. */
  @state() private hoverState?: { entityId: string; state: string };
  /** The entity whose test value is being typed in the Live strip. */
  @state() private editingValue?: string;
  /** The stage's scale as stepped with the zoom buttons, undefined while it
   * fits (`stageFitZoom`). Remembered between visits. */
  @state() private zoom = loadStageZoom();
  /** The top bar's ··· menu is open. */
  @state() private topMenuOpen = false;
  /** The top bar's watch picker is open. */
  @state() private watchMenuOpen = false;
  /** Why the last value typed in the tile card was refused. */
  @state() private fieldNote?: string;
  /** The Size card's Column, Row, Width and Height boxes, folded under the
   * size presets until asked for (or while a typed number was refused). */
  @state() private sizeFieldsOpen = false;
  /** The Add tile dialog is open, over the selected page. */
  @state() private addTileOpen = false;
  /** The foot bar's History dialog is open (`config-foot.ts`). */
  @state() private historyOpen = false;
  /** The foot bar's Raw configuration dialog is open. */
  @state() private rawOpen = false;
  /** The raw JSON went to the clipboard since the dialog opened. */
  @state() private rawCopied = false;
  /** The foot bar's dialogs opened so far, each once. */
  private readonly shownFootDialogs = new WeakSet<HTMLDialogElement>();

  /** The side columns' widths as dragged (a preference, saved), and the
   * host's measured content width and height, which fit them and cap the
   * self-scrolling columns. Zero before the first measurement. */
  @state() private columns: ColumnWidths = { ...PE_COLUMNS_DEFAULT };
  @state() private hostWidth = 0;
  @state() private hostHeight = 0;
  private sizeObserver?: ResizeObserver;
  /** The sticky block at the top (the bar and a note under it) the observer
   * measures, and its height: written to `--pe-top-h` on the host for the
   * sticky columns under it, and kept here for the drag's auto-scroll. */
  private observedTop?: HTMLElement;
  private topHeight = 0;
  /** Draws again while the toolbar says "Saved 3 min ago". */
  private readonly savedTicker = new SavedAgoTicker(this);

  /** The symbol grids' state (open, searched, recent) for the modules'
   * symbol fields. Not the panel's: its changes must draw this element. */
  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());
  /** The home's page photos: the list, each photo's bytes, upload and
   * delete (`page-photo-store.ts`). */
  private readonly photos = new PagePhotoStore(() => this.hass, () => this.requestUpdate());
  /** A photo's URL for the pictures, once its bytes are in. */
  private readonly photoUrl = (id: string): string | undefined => this.photos.url(id);
  /** The modules' view state (`WatchPagesEditorHost.uiState`). */
  private readonly uiState = new Map<string, unknown>();
  /** A drag on a number field running now: one undo step. */
  private readonly scrub = new ScrubRun();
  /** The title or box that drag holds: when it leaves the tree (its tile
   * went, its section folded) no end can come from it. */
  private scrubHandle?: Element;
  /** `memoIcons`: the provider and tick the memo was made for. */
  private iconMemo?: { provider: IconProvider; tick: number; icons: IconProvider };

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
  /** A pick of several was just dragged: the click the browser sends after
   * the pointer up is no plain click, and must not collapse the pick. Cleared
   * by that click, the next press, or the next task. */
  private swallowTileClick = false;
  /** A tile was picked from the Tiles list: the inspector starts at its top. */
  private inspectorToTop = false;
  /** The watch's screen in points, as last drawn, for the pointer arithmetic. */
  private stageScreen = REFERENCE_CASE.screen;
  private scrollFrame?: number;
  private windowArmed = false;
  private shownDialog?: HTMLDialogElement;

  /** Bumped by every load, so a reply that arrives after another watch was
   * picked, or after a newer load, is dropped. */
  private loadSeq = 0;
  private catalogSeq = 0;
  private historySeq = 0;
  private subscribeSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private pollTimer?: number;
  /** The connection whose `ready` event this element listens to. */
  private readyConnection?: HassConnectionEvents;

  private get watches(): OwnerSummary[] {
    return watchAppDevices(this.owners.length > 0 ? this.owners : (this.ownList ?? []), this.phones);
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

  /** A change from elsewhere waits: `busy`, or a number being dragged. The
   * drag edits (it is no gesture of `busy`), but a merge under it would be
   * undone by its next step, and the next save would write that back. */
  private get holdReload(): boolean {
    return this.busy || this.scrub.active;
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
    this.columns = loadColumnWidths(PE_COLUMNS_KEY, PE_COLUMNS_DEFAULT, PE_COLUMNS);
    this.watchSize();
    this.listenForReconnect();
    // Back in the tree after a visit elsewhere: the record may have moved.
    if (this.watchId !== undefined) this.openWatch(this.watchId, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointerdown", this.onWindowPointerDown, true);
    this.sizeObserver?.disconnect();
    this.observedTop = undefined;
    this.stopListeningForReconnect();
    this.reloadPending = false;
    this.cancelGestures();
    this.endScrub();
    this.endSubscription();
    this.stopPolling();
    this.stopTemplates();
    this.loadSeq++;
    this.catalogSeq++;
    this.statusPagesSeq++;
    this.httpLibrarySeq++;
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
      const id = followWatch(this.watches, this.watchId, this.ownerId, this.shellOwnsWatch || changed.has("ownerId"));
      if (id !== undefined) this.openWatch(id);
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
    // A catalog the phone published while the socket was down sent no event.
    void this.loadCatalog(watchId);
    void this.loadHttpLibrary();
    void this.loadVoice(watchId);
    void this.loadStatusPages(watchId);
    // A photo the phone handed over meanwhile, or a read that failed.
    if (this.photos.listState !== "idle") void this.photos.refreshList();
    // Music Assistant or the cloud may have come or gone meanwhile, and a
    // template's entities moved without the preview hearing.
    this.loadHomeData();
    if (this.templateSignature !== undefined) this.scheduleTemplates(0);
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
      // in a merge from another save.
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
    // The dragged number's field was drawn away (an undo, a merge, a folded
    // section): its drag can send no end any more.
    if (this.scrub.active && this.scrubHandle?.isConnected !== true) this.endScrub();
    // The shown page's templates may have changed (an edit, an undo, a merge,
    // another page picked): ask Home Assistant again after the debounce.
    this.followTemplates();
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
      // The page list scrolls on its own: bring the whole menu into it, not
      // only its first button.
      this.renderRoot.querySelector<HTMLElement>(".pe-menu")?.scrollIntoView({ block: "nearest" });
    }
    openConfigDialogs(this.renderRoot, this.shownFootDialogs);
    this.observeTop();
    this.savedTicker.show(this.renderRoot.querySelector(".cf-saved") !== null);
    if (this.focusHistory) {
      this.focusHistory = false;
      this.renderRoot.querySelector<HTMLElement>(".cf-history-btn")?.focus();
    }
    if (this.revealTile) {
      this.revealTile = false;
      const tile = this.selectedTileId === undefined ? undefined : this.tileButton(this.selectedTileId);
      tile?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    if (this.inspectorToTop) {
      this.inspectorToTop = false;
      // The column scrolls on its own beside the stage; stacked it does not,
      // and this changes nothing.
      const inspector = this.renderRoot.querySelector<HTMLElement>(".column.inspector");
      if (inspector !== null) inspector.scrollTop = 0;
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
    const had = this.selectedTileId;
    if (page === undefined) {
      page = listedWatchPages(document)[0];
      this.selectedPageId = page === undefined ? undefined : watchPageId(page);
      this.selectedTileId = undefined;
    }
    // The page strip's popover is the shown page's: it goes with the page.
    if (this.pageStripOpen !== undefined && (page === undefined || !sameWatchId(this.pageStripPageId, watchPageId(page)))) {
      this.pageStripOpen = undefined;
    }
    if (this.selectedTileId !== undefined && (page === undefined || this.tileOn(page, this.selectedTileId) === undefined)) {
      this.selectedTileId = undefined;
    }
    this.reconcilePick(page);
    // A row that goes away (a delete, an undo) takes its pointerleave with it.
    if (this.rowHoverTileId !== undefined && (page === undefined || this.tileOn(page, this.rowHoverTileId) === undefined)) {
      this.rowHoverTileId = undefined;
    }
    if (this.stageHoverTileId !== undefined && (page === undefined || this.tileOn(page, this.stageHoverTileId) === undefined)) {
      this.stageHoverTileId = undefined;
    }
    if (had !== undefined && this.selectedTileId === undefined) {
      // The tile went (an undo, a merge): its refusals and a drag on its
      // numbers go with it. Its fields are drawn away, so no blur is due.
      forgetTileSettingsNotes(this.uiState);
      this.endScrub();
    }
    keepWatchPagesSelection(this.watchId, { pageId: this.selectedPageId, tileId: this.selectedTileId });
  }

  /** Keep a pick of several tiles on tiles the shown page still has (an
   * undo, a merge, a delete took some away): two or more left stay picked,
   * the primary moving to the last of them when it went; one left is a plain
   * selection of it; none, nothing. */
  private reconcilePick(page: WatchPage | undefined): void {
    if (this.multi.size === 0) return;
    const kept = page === undefined ? [] : [...this.multi].filter((id) => this.tileOn(page, id) !== undefined);
    const primaryKept = kept.some((id) => sameWatchId(id, this.selectedTileId));
    if (kept.length === this.multi.size && primaryKept) return;
    if (kept.length >= 2) {
      if (!primaryKept) this.selectedTileId = kept[kept.length - 1];
      this.multi = new Set(kept);
      return;
    }
    this.multi = new Set();
    this.selectedTileId = kept[0];
  }

  /** Whether a tile is picked: one of a pick of several, or the selected one. */
  private isPicked(id: string): boolean {
    if (id === "") return false;
    if (this.multi.size === 0) return sameWatchId(id, this.selectedTileId);
    for (const picked of this.multi) if (sameWatchId(picked, id)) return true;
    return false;
  }

  /** Whether several tiles are picked together. */
  private get multiPicked(): boolean {
    return this.multi.size >= 2;
  }

  /** The page's tile ids in reading order, each once; tiles with no id are
   * left out, since no edit can name them. */
  private readingIds(page: WatchPage): string[] {
    const seen = new Set<string>();
    const ids: string[] = [];
    for (const tile of tilesInReadingOrder(page)) {
      const id = tileIdOf(tile);
      if (id === "" || seen.has(id.toUpperCase())) continue;
      seen.add(id.toUpperCase());
      ids.push(id);
    }
    return ids;
  }

  /** The picked tiles' ids in reading order: the pick of several, else the
   * selected tile, else none. */
  private pickedIds(page: WatchPage | undefined = this.currentPage()): string[] {
    if (page === undefined) return [];
    if (this.multi.size === 0) {
      const id = this.selectedTileId;
      return id !== undefined && this.tileOn(page, id) !== undefined ? [id] : [];
    }
    return this.readingIds(page).filter((id) => this.isPicked(id));
  }

  /** Pick these tiles, `primary` the selected one among them. Two or more
   * are a pick of several; one is a plain selection of it; none, nothing. */
  private setPick(ids: readonly string[], primary: string | undefined): void {
    if (ids.length < 2) {
      this.selectTile(ids[0]);
      return;
    }
    // The single tile's cards make way for the pick's card: a field still
    // holding text there commits first.
    if (!this.multiPicked) this.leaveTile();
    this.selectedTileId = primary !== undefined && ids.some((id) => sameWatchId(id, primary)) ? primary : ids[ids.length - 1];
    this.multi = new Set(ids);
    this.fieldNote = undefined;
  }

  /**
   * A click on a tile, on the stage or its Tiles row, as the complication
   * editor's `clickRow`. Shift picks every tile in reading order from the
   * selected one (the anchor, which stays the anchor) to this one. Cmd or
   * Ctrl adds this tile to the pick or takes it out. A plain click selects
   * this tile alone.
   */
  private clickTile(id: string, e: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean }): void {
    const page = this.currentPage();
    if (id === "" || page === undefined) return;
    const toggle = e.metaKey || e.ctrlKey;
    if (e.shiftKey && !toggle) {
      const order = this.readingIds(page);
      const anchor = this.selectedTileId !== undefined && this.tileOn(page, this.selectedTileId) !== undefined ? this.selectedTileId : id;
      const from = order.findIndex((t) => sameWatchId(t, anchor));
      const to = order.findIndex((t) => sameWatchId(t, id));
      if (from < 0 || to < 0) {
        this.selectTile(id);
        return;
      }
      this.setPick(order.slice(Math.min(from, to), Math.max(from, to) + 1), anchor);
      return;
    }
    if (toggle) {
      const picked = this.pickedIds(page);
      const had = picked.some((t) => sameWatchId(t, id));
      const next = had ? picked.filter((t) => !sameWatchId(t, id)) : [...picked, id];
      // Added, it is the primary; taken out, the primary stays unless it was
      // the one taken out.
      const primary = !had ? id : sameWatchId(id, this.selectedTileId) ? next[next.length - 1] : this.selectedTileId;
      this.setPick(next, primary);
      return;
    }
    this.selectTile(id);
  }

  /** Cmd or Ctrl+A, and Select all tiles in the ··· menu: every tile on the
   * shown page. One tile is a plain selection of it; none, nothing. */
  private selectAll(): void {
    const page = this.currentPage();
    if (page === undefined || isSmartWatchPage(page)) return;
    const ids = this.readingIds(page);
    if (ids.length === 0) return;
    this.setPick(ids, this.selectedTileId ?? ids[0]);
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
    this.leaveTile();
    this.closePageStrip();
    this.selectedPageId = pageId;
    this.selectedTileId = undefined;
    if (this.multi.size > 0) this.multi = new Set();
    this.rowHoverTileId = undefined;
    this.stageHoverTileId = undefined;
    this.fieldNote = undefined;
  }

  /** The stage's tint on a tile while its Tiles row is pointed at
   * (`rowHoverTileId`). Another row's leave does not take it away. */
  private peekTile(id: string, on: boolean): void {
    if (id === "") return;
    if (on) this.rowHoverTileId = id;
    else if (sameWatchId(id, this.rowHoverTileId)) this.rowHoverTileId = undefined;
  }

  /** The Tiles row's outline while its tile is pointed at on the stage
   * (`stageHoverTileId`), the other way round from `peekTile`. */
  private peekStageTile(id: string, on: boolean): void {
    if (id === "") return;
    if (on) this.stageHoverTileId = id;
    else if (sameWatchId(id, this.stageHoverTileId)) this.stageHoverTileId = undefined;
  }

  /** Select one tile, or none; a pick of several collapses to it. */
  private selectTile(tileId: string | undefined): void {
    const wasMulti = this.multi.size > 0;
    if (wasMulti) this.multi = new Set();
    if (tileId === this.selectedTileId && !wasMulti) return;
    this.leaveTile();
    this.selectedTileId = tileId;
    this.fieldNote = undefined;
  }

  /** Open one section's popover in the page strip, or shut the open one
   * when `section` is undefined or already open. */
  private togglePageStrip(section: WatchPageStripSection | undefined): void {
    const next = section === this.pageStripOpen ? undefined : section;
    if (next === this.pageStripOpen) return;
    this.closePageStrip();
    this.pageStripOpen = next;
    this.pageStripPageId = next === undefined ? undefined : this.selectedPageId;
  }

  /** Shut the page strip's popover. A field in it still holding focus is let
   * go first, so what it holds commits through its own blur rather than the
   * field vanishing with it. */
  private closePageStrip(): void {
    if (this.pageStripOpen === undefined) return;
    const focused = (this.renderRoot as ShadowRoot | undefined)?.activeElement;
    if (focused instanceof HTMLElement && focused.closest(".pe-ppop") !== null) focused.blur();
    this.pageStripOpen = undefined;
    this.pageStripPageId = undefined;
  }

  /**
   * The selected tile is about to change. A settings field still holding
   * text (an entity typed in full, not picked) is let go first, so its blur
   * commit lands on its own tile now, before the press that changes the
   * selection starts a drag and makes every edit wait. Then the old tile's
   * refusals go and a drag on one of its numbers ends.
   */
  private leaveTile(): void {
    const focused = (this.renderRoot as ShadowRoot).activeElement;
    if (focused instanceof HTMLElement && focused.closest(".ts-root") !== null) focused.blur();
    forgetTileSettingsNotes(this.uiState);
    this.endScrub();
  }

  /** A page's row in the Pages card, which is what takes focus. */
  private pageButton(pageId: string): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(`.pe-page-row[data-page="${CSS.escape(pageId)}"]`);
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
      // The other watch's library is not this one's.
      this.catalog = undefined;
      this.catalogSeq++;
      this.statusPagesRecord = undefined;
      this.statusPagesSeq++;
      this.cameraRefresh = watchCameraRefreshDefaults(undefined);
      this.behavior = undefined;
      this.behaviorSeq++;
      this.voiceDocument = undefined;
      this.voiceSeq++;
      this.history = [];
      if (this.historyState !== "unsupported") this.historyState = "loading";
      const selection = keptWatchPagesSelection(watchId);
      this.selectedPageId = selection.pageId;
      this.selectedTileId = selection.tileId;
      this.multi = new Set();
      this.renaming = undefined;
      this.menuPageId = undefined;
      this.closePageStrip();
      this.closeAsk();
      this.fieldNote = undefined;
      this.endScrub();
      // The modules' view state was about the other watch's tiles.
      this.uiState.clear();
      // So were the template renders: the next draw asks for this watch's.
      this.stopTemplates();
      this.templateRenders = new Map();
      // Test states were tried on the other watch's tiles.
      this.testStates = new Map();
      this.hoverState = undefined;
      this.editingValue = undefined;
      quiet = false;
    }
    this.startSubscription(watchId);
    void this.load(watchId, quiet);
    void this.loadCatalog(watchId);
    void this.loadHttpLibrary();
    void this.loadStatusPages(watchId);
    void this.loadBehavior(watchId);
    void this.loadVoice(watchId);
    if (!this.homeDataAsked && this.hass) {
      this.homeDataAsked = true;
      this.loadHomeData();
    }
  }

  /** Ask Home Assistant what the whole home has: a Music Assistant entry,
   * and whether its cloud can speak. Each call on its own, never in the
   * way of anything: a failed one keeps what was known (undefined at
   * first), and only the newest answer of each lands. */
  private loadHomeData(): void {
    const hass = this.hass;
    if (!hass) return;
    const music = ++this.musicSeq;
    fetchConfigEntries(hass, MUSIC_ASSISTANT_DOMAIN).then(
      (entries) => {
        if (music === this.musicSeq) this.homeData = { ...this.homeData, musicAssistant: watchHasConfigEntry(entries, MUSIC_ASSISTANT_DOMAIN) };
      },
      () => undefined,
    );
    const cloud = ++this.cloudSeq;
    fetchCloudStatus(hass).then(
      (status) => {
        if (cloud === this.cloudSeq) this.homeData = { ...this.homeData, cloudTTS: watchCloudTTSAvailable(status) };
      },
      () => undefined,
    );
  }

  // ── template renders ───────────────────────────────────────────────────

  /** After a draw: when the shown page's set of template tiles and texts is
   * not the one last asked about, ask again after the debounce, and every
   * 30 seconds from then (`panel.ts`'s `scheduleTemplates`). A page with no
   * template stops the clock. */
  private followTemplates(): void {
    if (!this.isConnected || !this.hass) return;
    const page = this.draft === undefined ? undefined : this.currentPage();
    const requests = watchTemplateRequests(page);
    const signature = watchTemplateSignature(requests);
    if (signature === this.templateSignature) return;
    this.templateSignature = signature;
    if (Object.keys(requests).length === 0) {
      this.stopTemplates(false);
      return;
    }
    this.scheduleTemplates(WATCH_TEMPLATE_DEBOUNCE_MS);
  }

  private scheduleTemplates(delay: number): void {
    if (this.templateDebounce !== undefined) window.clearTimeout(this.templateDebounce);
    this.templateDebounce = window.setTimeout(() => void this.refreshTemplates(), delay);
    if (this.templateInterval !== undefined) window.clearInterval(this.templateInterval);
    this.templateInterval = window.setInterval(() => void this.refreshTemplates(), WATCH_TEMPLATE_REFRESH_MS);
  }

  /** Stop both clocks and drop any answer still out. `forget` also forgets
   * the set last asked about, so the next draw asks afresh. */
  private stopTemplates(forget = true): void {
    if (this.templateDebounce !== undefined) window.clearTimeout(this.templateDebounce);
    if (this.templateInterval !== undefined) window.clearInterval(this.templateInterval);
    this.templateDebounce = undefined;
    this.templateInterval = undefined;
    this.templateRun++;
    if (forget) this.templateSignature = undefined;
  }

  /** Render the shown page's templates now. A newer call drops this one's
   * answer; a failed call keeps the last values. */
  private async refreshTemplates(): Promise<void> {
    this.templateDebounce = undefined;
    const hass = this.hass;
    if (!hass || !this.isConnected) return;
    const run = ++this.templateRun;
    const watchId = this.watchId;
    const requests = watchTemplateRequests(this.draft === undefined ? undefined : this.currentPage());
    if (Object.keys(requests).length === 0) return;
    try {
      const answer = await renderTemplates(hass, requests);
      if (run !== this.templateRun || watchId !== this.watchId) return;
      this.templateRenders = watchMergedRenders(this.templateRenders, requests, answer);
    } catch {
      // Kept: a dropped socket is no news about the templates.
    }
  }

  /** Read the watch's camera setting from its behavior document. A failed
   * read keeps the phone's defaults; only the newest read lands. */
  private async loadBehavior(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.behaviorSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "behavior");
      if (seq !== this.behaviorSeq || watchId !== this.watchId) return;
      this.cameraRefresh = watchCameraRefreshDefaults(record.revision > 0 ? record.document : undefined);
      this.behavior = record.revision > 0 && isJsonObject(record.document) ? record.document : undefined;
    } catch {
      if (seq !== this.behaviorSeq || watchId !== this.watchId) return;
      this.cameraRefresh = watchCameraRefreshDefaults(undefined);
      this.behavior = undefined;
    }
  }

  /** Read the watch's voice settings, whose defaults stand behind an Assist
   * or Speak tile (`voiceDefaults`). A failed read (an integration older
   * than the kind refuses it) is the same as none; only the newest read
   * lands. */
  private async loadVoice(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.voiceSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "voice");
      if (seq !== this.voiceSeq || watchId !== this.watchId) return;
      this.voiceDocument = voiceDocumentOfRecord(record);
    } catch {
      if (seq !== this.voiceSeq || watchId !== this.watchId) return;
      this.voiceDocument = undefined;
    }
  }

  /** The voice defaults behind an Assist or Speak tile: the watch's voice
   * settings when Home Assistant holds them, else the iPhone's catalog's,
   * else undefined (neither says). */
  private get voiceDefaults(): WatchCatalogVoice | undefined {
    return watchVoiceFallbacks(this.voiceDocument, this.catalog);
  }

  /** Read the iPhone's library beside the pages record. Never in the way of
   * the pages: a failed read (an integration older than the kind refuses
   * it) is the same as none, and only the newest read for the watch on
   * screen lands. */
  private async loadCatalog(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.catalogSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "catalog");
      if (seq !== this.catalogSeq || watchId !== this.watchId) return;
      this.catalog = watchCatalogFromRecord(record);
    } catch (error) {
      if (seq !== this.catalogSeq || watchId !== this.watchId) return;
      // An integration too old to know the kind refuses it: no catalog, and
      // nothing to tell anyone. Anything else keeps what is shown: a dropped
      // socket is not news that the phone took its library away.
      if (watchCatalogReadMeansNone(error)) this.catalog = undefined;
    }
  }

  /** Read the watch's own status pages record beside the pages, for the
   * status page pickers, which list it first and fall back to the iPhone's
   * catalog. An integration too old for the kind refuses it: none. Any other
   * failure keeps what is shown. */
  private async loadStatusPages(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.statusPagesSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "status_pages");
      if (seq !== this.statusPagesSeq || watchId !== this.watchId) return;
      this.statusPagesRecord = { revision: record.revision, document: record.document };
    } catch (error) {
      if (seq !== this.statusPagesSeq || watchId !== this.watchId) return;
      if (watchCatalogReadMeansNone(error)) this.statusPagesRecord = undefined;
    }
  }

  /** Read the home's HTTP action library, for the HTTP action pickers. An
   * integration older than it does not know the command: none, and the
   * pickers list the iPhone's catalog alone. Any other failure keeps what is
   * shown. Only the newest read lands. */
  private async loadHttpLibrary(): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.httpLibrarySeq;
    try {
      const record = await fetchHttpActions(hass);
      if (seq !== this.httpLibrarySeq) return;
      this.httpLibrary = readWatchHttpLibrary(record);
    } catch (error) {
      if (seq !== this.httpLibrarySeq) return;
      if (watchHttpLibraryReadMeansNone(error)) this.httpLibrary = undefined;
    }
  }

  /** The library the pickers and the preview read: the iPhone's catalog with
   * the watch's own status pages in place of the phone's list when Home
   * Assistant holds them, and the home's HTTP actions ahead of the phone's
   * (`http-library.ts`). The same object while none of them changed. */
  private get pickerCatalog(): WatchCatalog | undefined {
    const memo = this.pickerCatalogMemo;
    const record = this.statusPagesRecord;
    const library = this.httpLibrary;
    if (memo !== undefined && memo.catalog === this.catalog && memo.record === record && memo.library === library) return memo.out;
    const out = watchCatalogWithHttpLibrary(watchCatalogWithStatusPages(this.catalog, watchStatusPagesFromRecord(record)), library);
    this.pickerCatalogMemo = { catalog: this.catalog, record, library, out };
    return out;
  }

  /** Read the record. A quiet load keeps what is on screen until the answer
   * is in, which is how a change from elsewhere arrives. A quiet load during
   * a gesture or a save waits for it to end, so the document never moves
   * under the pointer or under a save. */
  private async load(watchId: string, quiet = false): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    if (quiet && this.holdReload) {
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
      if (quiet && this.holdReload) {
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
    if (!this.reloadPending || this.holdReload || this.watchId === undefined) return;
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
    if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The pages changed elsewhere. Your edits are kept." };
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
   * this way too. A new `catalog` revision reads the library again. */
  private startSubscription(watchId: string): void {
    const hass = this.hass;
    this.endSubscription();
    if (!hass) return;
    const seq = ++this.subscribeSeq;
    subscribeWatchConfig(hass, watchId, (event) => {
      if (seq !== this.subscribeSeq) return;
      if (event.kind === "catalog") {
        if (watchCatalogEventIsNews(event, this.catalog)) void this.loadCatalog(watchId);
        return;
      }
      if (event.kind === "behavior") {
        void this.loadBehavior(watchId);
        return;
      }
      if (event.kind === "voice") {
        void this.loadVoice(watchId);
        return;
      }
      if (event.kind === "status_pages") {
        void this.loadStatusPages(watchId);
        return;
      }
      if (event.kind !== "pages") return;
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
    if (this.holdReload) {
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
          rejected_reason: fresh.rejected_reason,
        };
      } else if (this.holdReload) {
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
    this.endScrub();
    this.draft?.endCoalesce();
    this.scrub.start();
    const handle = e.composedPath()[0];
    this.scrubHandle = handle instanceof Element ? handle : undefined;
    // The handle's own end never comes when the field goes from under the
    // pointer, so the pointer's release anywhere ends the run too: a run
    // never outlives its pointer.
    window.addEventListener("pointerup", this.onScrubPointerUp, true);
    window.addEventListener("pointercancel", this.onScrubPointerUp, true);
  };

  private onScrubEnd = (e: Event): void => {
    e.stopPropagation();
    this.endScrub();
  };

  private onScrubPointerUp = (): void => {
    this.endScrub();
  };

  /** End the drag's run, if one is going, and fetch a change that waited
   * for it. */
  private endScrub(): void {
    window.removeEventListener("pointerup", this.onScrubPointerUp, true);
    window.removeEventListener("pointercancel", this.onScrubPointerUp, true);
    this.scrubHandle = undefined;
    if (!this.scrub.end()) return;
    this.draft?.endCoalesce();
    this.flushPending();
  }

  /** What the two 3c modules are handed on each draw, for the selected page
   * (`editor-host.ts`). Undefined while there is nothing to edit. */
  private editorHost(page: WatchPage | undefined): WatchPagesEditorHost | undefined {
    const draft = this.draft;
    const hass = this.hass;
    if (draft === undefined || hass === undefined || page === undefined) return undefined;
    const pageId = watchPageId(page);
    // Read live (`editor-host.ts`): the draft object stays this watch's for
    // as long as the host can be called, and its document moves with every
    // edit, undo and merge. The page drawn stands in only once the page is
    // gone, when every edit to it is refused anyway.
    // Looked up again only when the document moved: a draw reads it often.
    let seen: { document: WatchPagesDocument; page: WatchPage } | undefined;
    const pageNow = (): WatchPage => {
      const document = draft.document;
      if (seen?.document !== document) seen = { document, page: findWatchPage(document, pageId) ?? page };
      return seen.page;
    };
    const busyNow = (): boolean => this.busy || this.editingOff(pageNow());
    const base = {
      hass,
      icons: this.memoIcons(),
      symbols: this.symbols,
      pageId,
      uiState: this.uiState,
      // A refused edit (`busy`) changes nothing, as a drag during a save
      // does: a save that merges must not find the document moved under it.
      apply: (next: WatchPagesDocument, options?: WatchPagesApplyOptions) =>
        this.draft === draft && !busyNow() && this.edit(next, this.scrub.options(options)),
      endCoalesce: () => this.draft?.endCoalesce(),
      selectTile: (id: string | undefined) => {
        this.selectTile(id);
        if (id !== undefined) this.revealTile = true;
      },
      selectSmartRule: (id: string | undefined) => {
        this.selectedSmartRuleId = id;
      },
      requestUpdate: () => this.requestUpdate(),
      deviceSiblings: (entityId: string) => watchDeviceSiblings(this.hass?.entities, entityId),
      loadImageSize: (url: string) => this.loadImageSize(url),
      photos: this.photos,
    };
    return extendHost(base, {
      document: () => draft.document,
      page: pageNow,
      otherPages: () => listedWatchPages(draft.document).filter((p) => !sameWatchId(p.id, pageId)),
      // The element's, read live: a catalog that arrives while a picker is
      // open is the one its next pick reads.
      catalog: () => this.pickerCatalog,
      voice: () => this.voiceDefaults,
      cameraRefreshDefaults: () => this.cameraRefresh,
      behavior: () => this.behavior,
      musicAssistant: () => this.homeData.musicAssistant,
      cloudTTS: () => this.homeData.cloudTTS,
      templateRenders: () => this.templateRenders,
      smartRuleId: () => {
        const id = this.selectedSmartRuleId;
        const rules = readSmartConfig(pageNow())?.rules ?? [];
        return id !== undefined && rules.some((r) => sameWatchId(r.id, id)) ? id : undefined;
      },
      busy: busyNow,
    });
  }

  /** The panel's provider with its names answered once per provider and
   * tick (`memoIconNames`). */
  private memoIcons(): IconProvider {
    const provider = this.icons ?? NO_ICONS;
    const memo = this.iconMemo;
    if (memo !== undefined && memo.provider === provider && memo.tick === this.iconsTick) return memo.icons;
    const icons = memoIconNames(provider);
    this.iconMemo = { provider, tick: this.iconsTick, icons };
    return icons;
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

  /**
   * Save the draft. Speak or Assist tiles left on Choose Speakers with no
   * speakers first ask, as the phone's save does: a warning, never a
   * refusal. `anyway` is the answer "Save Anyway".
   */
  private async save(anyway = false): Promise<WatchPagesSaveResult | undefined> {
    const hass = this.hass;
    const watchId = this.watchId;
    // A name or number still being typed is part of what gets saved.
    if (this.renaming) this.commitRename();
    this.commitTyping();
    const draft = this.draft;
    if (!hass || watchId === undefined || !draft || !draft.dirty || draft.saving || this.gesture || this.rowDrag) return;
    if (anyway) this.closeAsk();
    else if (watchSaveSpeakerWarning(draft.document, this.voiceDefaults, draft.base) !== undefined) {
      this.closeAsk();
      this.saveAsk = true;
      return undefined;
    }
    this.note = undefined;
    // The pages this save deletes: once it lands, the menu slots and
    // complication taps that open them are cleared (`clearPageRefs`).
    const deleted = deletedPageIds(watchPagesOf(draft.base), watchPagesOf(draft.document));
    const running = saveWatchPagesDraft(draft, {
      // A hold and slide direction left on Trigger entity with nothing
      // picked is saved as None, as the phone saves it. Every `all` rule
      // of a smart page the draft changed is resolved from Home Assistant's
      // states as they are at the send (part 3f batch 3).
      prepare: (document) => resolveSmartPagesBeforeSave(scrubWatchOrphanTriggers(document), draft.base, this.hass?.states),
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
    // Which photos a page uses has moved: the delete buttons follow.
    if (result.ok && this.photos.listState !== "idle") void this.photos.refreshList();
    if (result.ok && deleted.length > 0) {
      const cleared = await this.clearPageRefs(hass, watchId, deleted);
      if (cleared !== undefined && watchId === this.watchId && this.note === undefined) this.note = cleared;
    }
    return result;
  }

  /**
   * After a save that deleted pages: take every menu slot that went to one
   * of them out of the menus record, and make every complication tap that
   * opened one do nothing, each in its own save on the revision just read.
   * A note says what was cleared, or what could not be (the page is gone
   * either way; a slot left behind only fails on the watch, as before).
   */
  private async clearPageRefs(hass: HassLike, watchId: string, pageIds: string[]): Promise<Note | undefined> {
    let slots = 0;
    let taps = 0;
    const failed: string[] = [];
    try {
      const record = await fetchWatchConfig(hass, watchId, "menus");
      if (record.revision > 0 && isJsonObject(record.document)) {
        const next = clearPageFromMenus(record.document, pageIds);
        if (next !== record.document) {
          slots = pageIds.reduce((n, id) => n + menuSlotsOpeningPage(record.document as Record<string, unknown>, id).length, 0);
          await saveWatchConfig(hass, watchId, "menus", record.revision, next);
        }
      }
    } catch {
      failed.push("the menus");
      slots = 0;
    }
    try {
      const list = await fetchList(hass, watchId);
      for (const record of list.records) {
        if (record.deleted || !isJsonObject(record.document)) continue;
        const next = clearPageFromComplication(record.document, pageIds);
        if (next === undefined) continue;
        try {
          await saveRecord(hass, watchId, next, record.revision);
          taps++;
        } catch {
          failed.push(`"${typeof record.document.name === "string" ? record.document.name : "a complication"}"`);
        }
      }
    } catch {
      failed.push("the complications");
    }
    const done = [
      slots > 0 ? plural(slots, "menu slot", "menu slots") : undefined,
      taps > 0 ? `the tap of ${plural(taps, "complication", "complications")}` : undefined,
    ].filter((w): w is string => w !== undefined);
    if (failed.length > 0) {
      return { kind: "warn", text: `Saved. Could not clear the deleted page from ${failed.join(", ")}: change ${failed.length === 1 ? "it" : "them"} by hand.` };
    }
    if (done.length === 0) return undefined;
    return { kind: "ok", text: `Saved. Cleared the deleted page from ${done.join(" and ")}.` };
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
    const roomsKind = roomsKindFor(this.ownerList.find((o) => o.owner_watch_id === watchId));
    const ask: DeleteAsk = { pageId, roomsKind, behaviorState: "loading", removeLinks: true, refsState: "loading" };
    this.deleteAsk = ask;
    // The menu slots and complication taps that open the page, read beside
    // the room settings. Either may fail; the dialog then lists what it has.
    void Promise.all([
      fetchWatchConfig(hass, watchId, "menus").then(
        (record) => (record.revision > 0 && isJsonObject(record.document) ? record.document : undefined),
        () => undefined,
      ),
      fetchList(hass, watchId).then((list) => list.records, () => undefined),
    ]).then(([menus, complications]) => {
      const now = this.deleteAsk;
      if (now === undefined || now.pageId !== pageId) return;
      this.deleteAsk = { ...now, menus, complications, refsState: "ready" };
    });
    fetchWatchConfig(hass, watchId, roomsKind).then(
      (record) => {
        const behavior = record.revision > 0 && isJsonObject(record.document) ? record.document : undefined;
        const now = this.deleteAsk;
        if (now === undefined || now.pageId !== pageId) return;
        this.deleteAsk = { ...now, behavior, behaviorState: behavior === undefined ? "none" : "ready" };
      },
      () => {
        // Not knowing the room settings only means no room lines.
        const now = this.deleteAsk;
        if (now !== undefined && now.pageId === pageId) this.deleteAsk = { ...now, behaviorState: "none" };
      },
    );
  }

  /** Close the open question. Its state goes at once, not on the dialog's
   * close event, which comes a task later. A copy under way keeps its
   * question open until it ends (its pages save closes questions too). */
  private closeAsk(): void {
    if (this.copying) return;
    this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask")?.close();
    this.restoreAsk = undefined;
    this.deleteAsk = undefined;
    this.saveAsk = false;
    this.addTileOpen = false;
    this.copyAsk = undefined;
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

  /** Move the selected tile one step, or every picked tile together. */
  private nudge(direction: WatchNudgeDirection): void {
    const document = this.draft?.document;
    const pageId = this.selectedPageId;
    const tileId = this.selectedTileId;
    if (document === undefined || pageId === undefined || tileId === undefined) return;
    if (this.multiPicked) {
      const page = this.currentPage();
      const next = page === undefined ? undefined : this.nudgeAll(document, pageId, this.pickedIds(page), direction);
      if (next !== undefined && this.edit(next)) this.revealTile = true;
      return;
    }
    if (this.edit(nudgeWatchTile(document, pageId, tileId, direction))) this.revealTile = true;
  }

  /** Every picked tile one step, all or nothing (`moveWatchTilesBy`): the
   * document with all of them moved, or undefined when any one of them cannot
   * go. They move together, so a picked tile is never in the way of another
   * picked one, and none swaps with a tile that is not picked. */
  private nudgeAll(document: WatchPagesDocument, pageId: string, ids: readonly string[], direction: WatchNudgeDirection): WatchPagesDocument | undefined {
    const dcols = direction === "left" ? -1 : direction === "right" ? 1 : 0;
    const drows = direction === "up" ? -1 : direction === "down" ? 1 : 0;
    return moveWatchTilesBy(document, pageId, ids, dcols, drows);
  }

  /** Delete the one tile a Tiles row names, or else every picked tile, in
   * one edit (one undo step). */
  private deleteTile(tileId?: string): void {
    const document = this.draft?.document;
    const pageId = this.selectedPageId;
    if (document === undefined || pageId === undefined) return;
    const ids = tileId !== undefined ? [tileId] : this.pickedIds();
    if (ids.length === 0) return;
    const hadFocus = ids.some((id) => this.tileButton(id)?.matches(":focus") ?? false);
    let next = document;
    for (const id of ids) next = deleteWatchTile(next, pageId, id);
    if (this.edit(next) && hadFocus) {
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(".pe-screen")?.focus());
    }
  }

  /** How many of these tiles may be copied onto their page now. */
  private copyableCount(page: WatchPage, ids: readonly string[]): number {
    return ids.filter((id) => {
      const tile = this.tileOn(page, id);
      return tile !== undefined && this.duplicateRefusal(page, tile) === undefined;
    }).length;
  }

  /** Why a tile cannot be copied onto its own page, or undefined when it
   * can. A page holds one tile per entity of most kinds (`watchAddRefusal`),
   * so a light's tile has nowhere to go; a spacer, a header, a template and
   * the like copy freely. */
  private duplicateRefusal(page: WatchPage, tile: WatchPageTile): string | undefined {
    const document = this.draft?.document;
    if (document === undefined || tileIdOf(tile) === "") return "This tile cannot be copied.";
    if (this.busy || this.editingOff(page)) return this.saving ? SAVING_TEXT : "Turn off Watch view to copy a tile.";
    const refusal = watchAddRefusal(document, watchPageId(page), tileEntityId(duplicateOf(tile)));
    if (refusal === undefined) return undefined;
    return refusal === "onPage" ? "This page already has a tile for that entity." : "This page takes no more tiles.";
  }

  /** Copy a tile onto its page, at the first free place for its size, and
   * select the copy. With no tile named and several picked, every picked
   * tile that may be copied, in one edit, and the copies are picked. */
  private duplicateTile(tileId?: string): void {
    if (tileId === undefined && this.multiPicked) {
      this.duplicatePicked();
      return;
    }
    tileId ??= this.selectedTileId;
    const document = this.draft?.document;
    const page = this.currentPage();
    const tile = page === undefined || tileId === undefined ? undefined : this.tileOn(page, tileId);
    if (document === undefined || page === undefined || tile === undefined || this.duplicateRefusal(page, tile) !== undefined) return;
    const copy = duplicateOf(tile);
    if (!this.edit(addWatchTile(document, watchPageId(page), copy))) return;
    this.selectTile(copy.id as string);
    this.revealTile = true;
  }

  /** Copy every picked tile that may be copied, in reading order, each at
   * the first free place, as one edit; then pick the copies. A tile refused
   * (`duplicateRefusal`) is left out and the rest still go. */
  private duplicatePicked(): void {
    const document = this.draft?.document;
    const page = this.currentPage();
    if (document === undefined || page === undefined) return;
    const pageId = watchPageId(page);
    let next = document;
    const copies: string[] = [];
    for (const id of this.pickedIds(page)) {
      const tile = this.tileOn(page, id);
      if (tile === undefined || this.duplicateRefusal(page, tile) !== undefined) continue;
      const copy = duplicateOf(tile);
      const added = addWatchTile(next, pageId, copy);
      if (added === next) continue;
      next = added;
      copies.push(copy.id as string);
    }
    if (copies.length === 0 || !this.edit(next)) return;
    this.setPick(copies, copies[copies.length - 1]);
    this.revealTile = true;
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
    if (this.scrub.active && SCRUB_HELD_KEYS.has(e.key)) {
      // While a number is dragged, a key that would take its tile away
      // (Escape, Delete) or move it waits for the drag to end: the field
      // would go from under the pointer.
      e.preventDefault();
      return;
    }
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
      // Back to the row: its ··· button hides again once the menu is shut.
      this.focusPageRow = id;
      return;
    }
    if (e.key === "Escape" && this.topMenuOpen) {
      e.preventDefault();
      this.topMenuOpen = false;
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(".wa-bar .tb-more")?.focus());
      return;
    }
    if (e.key === "Escape" && this.watchMenuOpen) {
      e.preventDefault();
      this.watchMenuOpen = false;
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(".wa-bar .pe-watch-open")?.focus());
      return;
    }
    if (e.key === "Escape" && this.pageStripOpen !== undefined) {
      e.preventDefault();
      const section = this.pageStripOpen;
      this.closePageStrip();
      // Back to the chip that opened it.
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(`.pe-pchip[data-section="${section}"]`)?.focus());
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
    // Cmd or Ctrl+A picks every tile on the page, from anywhere in the editor
    // but a text field; while Watch view draws the page, the browser keeps it.
    if (mod && !e.altKey && !e.shiftKey && key === "a" && !dragging && !this.editingOff()) {
      const page = this.currentPage();
      if (page !== undefined && !isSmartWatchPage(page)) {
        e.preventDefault();
        this.selectAll();
        return;
      }
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
    // Keys typed in the row's rename field or on its buttons are theirs.
    if (e.target !== e.currentTarget) return;
    if ((e.key === "Enter" || e.key === " ") && !e.altKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      this.selectPage(pageId);
      return;
    }
    if (e.key === "F2") {
      e.preventDefault();
      this.startRename(pageId);
      return;
    }
    if (!e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      this.movePage(pageId, index - 1, true);
    } else if (e.key === "ArrowDown" && index < count - 1) {
      e.preventDefault();
      this.movePage(pageId, index + 1, true);
    }
  }

  /** A press anywhere outside an open menu (a page row's, the top bar's
   * ···, the watch picker, or a page strip popover) closes it. */
  private onWindowPointerDown = (e: PointerEvent): void => {
    if (this.menuPageId === undefined && !this.topMenuOpen && !this.watchMenuOpen && this.pageStripOpen === undefined) return;
    const path = e.composedPath();
    const within = (...names: string[]) => path.some((n) => n instanceof HTMLElement && names.some((c) => n.classList.contains(c)));
    if (this.menuPageId !== undefined && !within("pe-menu", "pe-more")) this.menuPageId = undefined;
    if (this.topMenuOpen && !within("pe-top-menu")) this.topMenuOpen = false;
    if (this.watchMenuOpen && !within("pe-watch-picker")) this.watchMenuOpen = false;
    // A popover stays open for a press on its own chip or in it, and in a
    // modal its fields opened (the Smart Page convert question sits in the
    // top layer, outside the popover's box) or the symbol browser.
    const inDialog = path.some((n) => n instanceof HTMLElement && n.tagName === "DIALOG");
    if (this.pageStripOpen !== undefined && !inDialog && !within("pe-pstrip-item", "sym-browse")) this.closePageStrip();
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

  /** A press on a tile. A mouse or a pen selects it and may drag it at once;
   * pressed on one of a pick of several, it drags the whole pick. A finger
   * drags only a selected or picked tile (the only ones with `touch-action:
   * none`); on any other tile it scrolls the page, and a tap selects. */
  private onTilePointerDown(e: PointerEvent, tileId: string): void {
    if (e.button !== 0 || !e.isPrimary || this.gesture || this.editingOff()) return;
    // Shift, Cmd or Ctrl held: no drag, the click picks (`clickTile`).
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    // No drag while a save is out: a conflict merges under the save, and a
    // drag that ended on the old base would put the merged tiles back.
    if (this.saving) return;
    const draft = this.draft;
    if (draft === undefined) return;
    this.swallowTileClick = false;
    // A plain press on one of a pick of several keeps the pick and drags all
    // of it (a click without a drag still collapses it, in `clickTile`); on a
    // tile outside the pick it collapses to that tile, as a plain click does,
    // and drags it alone. A finger drags only a picked tile.
    const group = this.multiPicked && this.isPicked(tileId);
    const selected = group || (sameWatchId(tileId, this.selectedTileId) && !this.multiPicked);
    if (e.pointerType === "touch" && !selected) return;
    const page = this.currentPage();
    const tile = page === undefined ? undefined : this.tileOn(page, tileId);
    const button = e.currentTarget as HTMLElement;
    if (page === undefined || tile === undefined) return;
    if (!selected) this.selectTile(tileId);
    const members = group
      ? this.pickedIds(page).flatMap((id) => {
        const t = this.tileOn(page, id);
        return t === undefined ? [] : [{ id, rect: watchTileRect(t) }];
      })
      : [];
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
      ...(members.length >= 2 ? { group: members } : {}),
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

  /** A press on a page row: the whole row drags with a mouse or a pen, the
   * grip with a finger too. Its buttons, its menu and its rename field are
   * never a drag. */
  private onRowPointerDown(e: PointerEvent, pageId: string, index: number): void {
    if (e.button !== 0 || !e.isPrimary || this.rowDrag || this.gesture) return;
    if (pressedRowControl(e)) return;
    const row = e.currentTarget as EventTarget;
    const path = e.composedPath();
    const grip = path.slice(0, Math.max(0, path.indexOf(row))).some((n) => (n as Partial<Element>).classList?.contains("grip") === true);
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
      if (g.started && g.kind === "move" && g.group !== undefined) {
        // The click after this pointer up lands on a picked tile; it is the
        // drag's, not a plain click that would collapse the pick.
        this.swallowTileClick = true;
        setTimeout(() => { this.swallowTileClick = false; }, 0);
      }
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
      if (g.group !== undefined) {
        // A pick of several moves by the grabbed tile's delta; it never swaps.
        g.pointerTileId = undefined;
        g.outcome = this.groupDropOutcome(g, g.cell);
        this.requestUpdate();
        return;
      }
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
      if (g.group !== undefined) {
        this.finishGroupMove(document, g, g.cell, g.group);
        return;
      }
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

  /** What dropping a pick of several would do: `same` with no delta, `move`
   * when every picked tile may go (`canMoveWatchTilesBy`), else `none`. Never
   * a swap. `cell` is the grabbed tile's target. */
  private groupDropOutcome(g: MoveGesture, cell: WatchCell): WatchDropOutcome {
    const { dcols, drows } = moveDelta(g, cell);
    if (dcols === 0 && drows === 0) return { kind: "same", cell };
    const document = this.draft?.document;
    const ids = (g.group ?? []).map((m) => m.id);
    const ok = document !== undefined && canMoveWatchTilesBy(document, g.pageId, ids, dcols, drows);
    return { kind: ok ? "move" : "none", cell };
  }

  /** Drop a pick of several: every picked tile moved by the grabbed tile's
   * delta, in one edit (one undo step). The pick stays, the grabbed tile its
   * primary, brought into view. A refused drop changes nothing. */
  private finishGroupMove(document: WatchPagesDocument, g: MoveGesture, cell: WatchCell, group: readonly { id: string; rect: WatchRect }[]): void {
    const { dcols, drows } = moveDelta(g, cell);
    if (dcols === 0 && drows === 0) return;
    const next = moveWatchTilesBy(document, g.pageId, group.map((m) => m.id), dcols, drows);
    if (next === undefined) {
      if (group.some((m) => m.rect.row + drows + m.rect.rowSpan > WATCH_EDITOR_MAX_ROWS)) {
        this.refuse(`${PAGE_END_TEXT} These tiles cannot go that far down.`);
      }
      return;
    }
    if (!this.edit(next)) return;
    if (this.isPicked(g.tileId)) this.selectedTileId = g.tileId;
    this.revealTile = true;
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
      // The sticky top block covers the top of the editor's own box: the
      // edge to scroll up from is under it.
      const covered = box === this ? this.topHeight : 0;
      const step = autoScrollStep(g.clientY, Math.max(0, rect.top + covered), Math.min(window.innerHeight, rect.bottom));
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
        text: `Revision ${ask.entry.revision} is back. The watch picks it up the next time it checks.`,
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

  // ── no record: "Start with an empty page" ──────────────────────────────

  /** Create the watch's pages record with one empty page, then open that
   * page. Home Assistant takes it only for a paired watch; a record that came
   * in meanwhile is read and shown instead. */
  private async startEmptyPage(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    if (!hass || watchId === undefined || this.starting) return;
    // A record is there (perhaps one this panel cannot read): never start
    // over it.
    if (this.record !== undefined && this.record.revision > 0) return;
    this.starting = true;
    this.note = undefined;
    const result = await createWatchPages((base, document) => saveWatchConfig(hass, watchId, "pages", base, document));
    this.starting = false;
    if (watchId !== this.watchId) return;
    if (result.ok) {
      this.note = { kind: "ok", text: `Started with an empty page. The ${this.onPhone ? "iPhone" : "watch"} picks it up the next time it checks.` };
      this.selectedPageId = result.pageId;
      this.selectedTileId = undefined;
    } else if (result.code === "no_record") {
      this.note = { kind: "warn", text: PAIR_FIRST_TEXT };
      return;
    } else if (result.code === "conflict") {
      this.note = { kind: "warn", text: PAGES_START_CONFLICT_TEXT };
    } else {
      this.note = { kind: "err", text: `Could not start: ${result.message}` };
      return;
    }
    void this.load(watchId, true);
  }

  // ── an iPhone: Copy from watch ─────────────────────────────────────────

  /** Every device this element may list, from the panel or read itself. */
  private get ownerList(): readonly OwnerSummary[] {
    return this.owners.length > 0 ? this.owners : (this.ownList ?? []);
  }

  /** The device on show is one of the home's iPhones (`phone-pages.ts`):
   * its pages start empty, and Copy from watch can fill them. */
  private get onPhone(): boolean {
    return this.phones && isPhoneId(this.ownerList, this.watchId);
  }

  /** The watches a copy can come from. */
  private get copySources(): OwnerSummary[] {
    return settingsWatches(this.ownerList);
  }

  /** Open the Copy from watch question on the first watch, and read its
   * pages for the list. */
  private openCopy(): void {
    if (!this.onPhone || this.copying) return;
    this.topMenuOpen = false;
    this.closeAsk();
    this.pickCopyWatch(this.copySources[0]?.owner_watch_id);
  }

  /** The question on another watch: its pages are read again, and the
   * choice goes back to all pages. */
  private pickCopyWatch(watch: string | undefined): void {
    this.copyAsk = { watch, state: watch === undefined ? "ready" : "loading", scope: "all" };
    if (watch !== undefined) void this.readCopySource(watch);
  }

  /** Read the picked watch's pages, for the question's list. Only the newest
   * read lands. It is read again when the copy runs. */
  private async readCopySource(watch: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.copySeq;
    try {
      const record = await fetchWatchConfig(hass, watch, "pages");
      if (seq !== this.copySeq || this.copyAsk?.watch !== watch) return;
      const pages = record.revision > 0 ? asWatchPagesDocument(record.document) : undefined;
      this.copyAsk = { ...this.copyAsk, state: "ready", ...(pages === undefined ? {} : { pages }) };
    } catch (err) {
      if (seq !== this.copySeq || this.copyAsk?.watch !== watch) return;
      this.copyAsk = { ...this.copyAsk, state: "error", error: errText(err) };
    }
  }

  /** Why Copy cannot run now, or undefined when it can. */
  private copyBlocked(ask: CopyAsk): string | undefined {
    if (ask.watch === undefined) return "No watch has connected yet.";
    if (ask.state !== "ready") return ask.state === "loading" ? "Reading the watch's pages." : "The watch's pages could not be read.";
    if (ask.pages === undefined || listedWatchPages(ask.pages).length === 0) return "This watch has no pages to copy.";
    if (this.draft?.dirty ?? false) return "Save or discard your edits first. A copy is saved at once.";
    if (this.busy) return SAVING_TEXT;
    return undefined;
  }

  /**
   * Copy from the picked watch onto this iPhone (`copyToPhone`): the phone's
   * status pages, menus and rooms are saved here, and its pages through the
   * draft, as one undo step and a save like any other. Nothing of the
   * watch's is written. The first copied page opens.
   */
  private async runCopy(): Promise<void> {
    const ask = this.copyAsk;
    const hass = this.hass;
    const phone = this.watchId;
    if (ask === undefined || this.copyBlocked(ask) !== undefined || !hass || phone === undefined || this.copying || !this.onPhone) return;
    const watch = ask.watch!;
    const sources = this.copySources;
    const source = sources.find((w) => w.owner_watch_id === watch);
    const from = source === undefined ? "the watch" : watchName(source, sources);
    const scope: PhoneCopyScope = ask.scope === "all" ? { kind: "all" } : { kind: "page", pageId: ask.scope };
    this.copying = true;
    this.note = undefined;
    const result = await copyToPhone({
      read: (owner, kind) => fetchWatchConfig(hass, owner, kind),
      savePhone: (kind, base, document) => saveWatchConfig(hass, phone, kind, base, document),
      savePages: (document) => this.saveCopiedPages(hass, phone, document),
    }, { watch, watchRooms: roomsKindFor(source), phone, scope, phonePages: this.draft?.document });
    this.copying = false;
    if (phone !== this.watchId) {
      // Another device opened meanwhile, and its `closeAsk` waited for the
      // copy: the question goes now, not over that device.
      this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-copy")?.close();
      this.copyAsk = undefined;
      return;
    }
    this.closeAsk();
    this.note = phoneCopyNote(result, from);
    if (result.saved.includes("status_pages")) void this.loadStatusPages(phone);
    if (result.ok) {
      this.selectedPageId = result.firstPageId;
      this.selectedTileId = undefined;
      this.multi = new Set();
    }
  }

  /** The copy's pages, saved as this editor saves pages: into the draft as
   * one undo step, then a save. A phone with no pages record yet gets its
   * first, over revision 0, read back at once. */
  private async saveCopiedPages(hass: HassLike, phone: string, document: WatchPagesDocument): Promise<{ ok: boolean; code?: string; message?: string }> {
    if (phone !== this.watchId) return { ok: false, code: "moved", message: "Another device was opened meanwhile." };
    const draft = this.draft;
    if (draft === undefined) {
      try {
        await saveWatchConfig(hass, phone, "pages", 0, document);
      } catch (err) {
        return { ok: false, code: errCode(err) ?? "unknown", message: errText(err) };
      }
      await this.load(phone, true);
      return { ok: true };
    }
    draft.apply(document);
    this.requestUpdate();
    const result = await this.save(true);
    return result ?? { ok: false, code: "busy", message: SAVING_TEXT };
  }

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const watches = this.watches;
    const draft = this.draft;
    return html`
      <div class="pe-top">
        ${this.renderTopBar(draft)}
        ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${this.renderBody(watches)}
      ${this.restoreAsk ? this.renderRestoreAsk(this.restoreAsk) : nothing}
      ${this.deleteAsk && draft ? this.renderDeleteAsk(this.deleteAsk, draft.document) : nothing}
      ${this.saveAsk && draft ? this.renderSaveAsk(draft.document, draft.base) : nothing}
      ${this.addTileOpen ? this.renderAddTileDialog() : nothing}
      ${this.copyAsk ? this.renderCopyAsk(this.copyAsk) : nothing}
    `;
  }

  /** Whether the editor is one column: the measured width, or Home
   * Assistant saying it is a phone. Before the first measurement it is not. */
  private get stacked(): boolean {
    return this.narrow || (this.hostWidth > 0 && this.hostWidth <= PE_STACK_WIDTH);
  }

  /**
   * The top bar, the complication editor's (`panel.ts`'s `renderTopBar`):
   * the way back and + Add page at the left; then the watch picker (with
   * more than one watch), where the stored copy has got to, the ··· menu,
   * Save with when the copy was saved, Menus, Watch settings and the help at
   * the right. Undo and Redo are in the canvas head, beside the page's name.
   * Two rows when stacked. Drawn in every state, so a watch with no pages, or
   * one still loading, can still be left for another.
   */
  private renderTopBar(draft: WatchPagesDraft | undefined): TemplateResult {
    const dirty = draft?.dirty ?? false;
    const watches = this.watches;
    const shell = this.shellOwnsWatch;
    return html`<div class="wa-bar ${this.stacked ? "stacked" : ""}" role="toolbar" aria-label="Watch pages">
      ${this.haMenu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${() => this.onHaMenu?.()}>${uiIcon("menu")}</button>` : nothing}
      ${shell ? nothing : html`<button class="tb-btn tb-back" title="Back to complications"
        @click=${() => (this.onBack ? this.onBack() : navigateWatchPages(undefined, false))}>${uiIcon("left")}<span>Complications</span></button>`}
      ${shell ? nothing : html`<button class="tb-btn tb-new" ?disabled=${draft === undefined || this.saving}
        title=${this.saving ? SAVING_TEXT : "Add an empty page after the last one"}
        @click=${() => this.addPage()}>${uiIcon("plus")}<span>Add page</span></button>`}
      <span class="spacer"></span>
      ${watches.length > 1 && !shell ? this.renderWatchPicker(watches) : nothing}
      ${this.renderSyncPill(draft)}
      ${this.renderTopMenu(draft)}
      ${draft ? html`<button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S)` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
        <span class="tb-saved" title=${dirty ? "Unsaved changes" : ""}>${renderConfigSaved(this.record)}</span>` : nothing}
      ${shell ? nothing : html`<button class="tb-btn tb-menus" title="The watch's Anywhere menu, Entity quick menu and page switcher"
        @click=${() => (this.onMenus ? this.onMenus() : navigateMenusFromPages(undefined))}>${uiIcon("radial")}<span>Menus</span></button>`}
      ${this.barActions}
      <button class="help" title="Help: pages in Home Assistant" aria-label="Help"
        @click=${() => window.open(WATCH_PAGES_HELP_URL, "_blank", "noopener")}>?</button>
    </div>`;
  }

  /** Where the stored copy has got to, as the complication editor's sync
   * pill: green once a device collected it, amber otherwise. The same facts
   * as the foot bar's line (`configFootStatus`). */
  private renderSyncPill(draft: WatchPagesDraft | undefined): TemplateResult | typeof nothing {
    const record = this.record;
    if (record === undefined || record.revision <= 0) return nothing;
    const status = configFootStatus({
      record,
      size: draft === undefined ? 0 : sizeOf(draft.document),
      limit: WATCH_PAGES_LIMIT_BYTES,
      noun: "pages",
      historyState: this.historyState,
    });
    return html`<span class="tb-sync ${status.tone === "ok" ? "ok" : "warn"}" title=${`${status.state}. ${status.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${status.state}</span>
    </span>`;
  }

  /** The "Start with an empty page" flow applies: Home Assistant holds no
   * pages for this watch, and none it cannot read. */
  /** Whether this watch's iPhone may still move its pages here, so the
   * start waits behind a confirm (`noRecordStart`). */
  private noRecordState(watches: readonly OwnerSummary[] = this.watches): NoRecordStart {
    return noRecordStart(watches.find((w) => w.owner_watch_id === this.watchId));
  }

  /** A start from the button, the link or the ··· menu: while the iPhone's
   * move may still come it asks first. */
  private askStartEmptyPage(state: NoRecordStart = this.noRecordState()): void {
    if (mayStart(state)) void this.startEmptyPage();
  }

  private canStart(): boolean {
    const record = this.record;
    return this.watchId !== undefined && record !== undefined && record.revision <= 0 && !watchRecordUnreadable(record, asWatchPagesDocument);
  }

  /** The ··· menu: Select all tiles, Discard edits, and Start with an empty
   * page while that applies. */
  private renderTopMenu(draft: WatchPagesDraft | undefined): TemplateResult | typeof nothing {
    const start = this.canStart();
    const phone = this.onPhone;
    if (draft === undefined && !start && !phone) return nothing;
    const open = this.topMenuOpen;
    const run = (fn: () => void) => () => { this.topMenuOpen = false; fn(); };
    // Select all needs two tiles to make a pick of several, and a page drawn
    // to edit.
    const page = open && draft ? this.currentPage() : undefined;
    const selectable = page === undefined || isSmartWatchPage(page) || this.editingOff(page) ? 0 : this.readingIds(page).length;
    return html`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} aria-label="More actions" title="More"
        @click=${() => { this.topMenuOpen = !open; }}>···</button>
      ${open ? html`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${draft ? html`<button class="row pe-select-all" role="menuitem" ?disabled=${selectable < 2}
          title=${`Pick every tile on this page (${MOD}A)`}
          @click=${run(() => this.selectAll())}>Select all tiles</button>` : nothing}
        ${draft ? html`<button class="row" role="menuitem" ?disabled=${!draft.dirty || this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${run(() => this.discard())}>Discard edits</button>` : nothing}
        ${start ? html`<button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${run(() => this.askStartEmptyPage())}>${this.noRecordState() === "wait" ? START_FRESH_BUTTON : PAGES_START_BUTTON}</button>` : nothing}
        ${phone ? html`<button class="row pe-copy-menu" role="menuitem" ?disabled=${this.copying || this.copySources.length === 0}
          title=${this.copySources.length === 0 ? "No watch has connected yet" : "Copy one page or all pages from a watch"}
          @click=${run(() => this.openCopy())}>Copy from watch…</button>` : nothing}
      </div>` : nothing}
    </span>`;
  }

  /** The watch glyph in its person's color, for the picker. */
  private watchGlyph(watch: OwnerSummary): TemplateResult {
    const people = peopleOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
    const index = people.findIndex((p) => p.owners.some((o) => o.owner_watch_id === watch.owner_watch_id));
    const color = personColorVar(index);
    return html`<span class="pe-chip-glyph" style=${color ? `--pe-person: ${color}` : nothing} aria-hidden="true">${uiIcon("watch")}</span>`;
  }

  /** The watch picker, the complication editor's Browse button in the bar:
   * the open watch's glyph and name and a caret, over a menu of every watch
   * with a check on the open one. A pick opens that watch's pages. */
  private renderWatchPicker(watches: readonly OwnerSummary[]): TemplateResult {
    const current = watches.find((w) => w.owner_watch_id === this.watchId);
    const open = this.watchMenuOpen;
    return html`<div class="picker pe-watch-picker">
      <button class="tb-browse pe-watch-open" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
        title="Pick the watch whose pages to edit" aria-label=${current ? `Watch: ${watchName(current, watches)}. Pick another` : "Pick a watch"}
        @click=${() => { this.watchMenuOpen = !open; }}>
        ${current ? this.watchGlyph(current) : html`<span class="pe-chip-glyph" aria-hidden="true">${uiIcon("watch")}</span>`}<span class="tb-browse-l">${current ? watchName(current, watches) : "Pick a watch"}</span>${uiIcon("chevron")}
      </button>
      ${open ? html`<div class="pop-menu pe-watch-menu" role="menu" aria-label="Watches">
        ${watches.map((w) => {
          const on = w.owner_watch_id === this.watchId;
          return html`<button class="row pe-watch-row" role="menuitemradio" aria-checked=${on ? "true" : "false"} data-watch=${w.owner_watch_id}
            @click=${() => { this.watchMenuOpen = false; if (!on) this.openWatch(w.owner_watch_id); }}>
            ${this.watchGlyph(w)}<span class="pe-watch-name">${watchName(w, watches)}</span>${on ? html`<span class="pe-watch-check">${uiIcon("check")}</span>` : nothing}
          </button>`;
        })}
      </div>` : nothing}
    </div>`;
  }

  // ── the columns ────────────────────────────────────────────────────────

  /** Measure the host, not the window: the Home Assistant sidebar changes
   * the editor's width without changing the window's. Its height caps the
   * page list and the cards, which scroll on their own past it. */
  private watchSize(): void {
    if (typeof ResizeObserver === "undefined") return;
    this.sizeObserver ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== this) {
          this.measureTop(entry.target as HTMLElement);
          continue;
        }
        const box = entry.contentRect;
        if (Math.abs(box.width - this.hostWidth) >= 1) this.hostWidth = box.width;
        // The content box: a sticky column stops at the host's padding, so
        // this is the height it can have on screen.
        if (Math.abs(box.height - this.hostHeight) >= 1) this.hostHeight = box.height;
      }
    });
    this.sizeObserver.observe(this);
    this.observeTop();
  }

  /** Watch the sticky top block's height too. It is drawn once and kept, but
   * a reconnect starts the observer over, so this runs after every draw and
   * does nothing when the same block is watched already. */
  private observeTop(): void {
    const observer = this.sizeObserver;
    if (observer === undefined) return;
    const top = this.renderRoot?.querySelector<HTMLElement>(".pe-top") ?? undefined;
    if (top === this.observedTop) return;
    if (this.observedTop !== undefined) observer.unobserve(this.observedTop);
    this.observedTop = top;
    if (top !== undefined) observer.observe(top);
  }

  /** The top block's whole height, edge to edge, onto the host: no draw
   * follows, the sticky columns read it straight from CSS. */
  private measureTop(top: HTMLElement): void {
    const height = top.offsetHeight;
    if (height === this.topHeight) return;
    this.topHeight = height;
    this.style.setProperty("--pe-top-h", `${height}px`);
  }

  /** The side widths the grid can afford right now. */
  private fittedColumns(): ColumnWidths {
    if (this.hostWidth > 0 && this.hostWidth <= PE_STACK_WIDTH) return this.columns;
    return fitColumnWidths(this.hostWidth - PE_GRID_CHROME, this.columns, PE_COLUMNS);
  }

  private renderGutter(side: "left" | "right"): TemplateResult {
    return html`<div class="gutter ${side}" role="separator" aria-orientation="vertical"
      aria-label=${side === "left" ? "Resize the pages and tiles column" : "Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${(e: PointerEvent) => {
        // Drag from the width on screen, not the stored preference.
        const shown = this.fittedColumns();
        beginColumnDrag(e, {
          side,
          base: side === "left" ? shown.left : shown.right,
          limits: PE_COLUMNS,
          onWidth: (width) => { this.columns = { ...this.columns, [side]: width }; },
          onEnd: () => saveColumnWidths(PE_COLUMNS_KEY, this.columns),
        });
      }}
      @dblclick=${() => {
        this.columns = { ...this.columns, [side]: PE_COLUMNS_DEFAULT[side] };
        saveColumnWidths(PE_COLUMNS_KEY, this.columns);
      }}></div>`;
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
    // An iPhone starts with no pages, and is never waiting for any.
    if (this.onPhone && !watchRecordUnreadable(record, asWatchPagesDocument)
      && (record.revision <= 0 || (draft !== undefined && listedWatchPages(draft.document).length === 0))) {
      return this.renderPhoneEmpty(record, draft);
    }
    if (record.revision <= 0 || draft === undefined) {
      // Edits kept from before Home Assistant lost this watch's record (it
      // was removed, or the store started over). They stay, and are merged
      // into the record that comes next (a start here, or the iPhone's
      // upload); said here, with a way to drop them, so the leave question
      // never asks about edits no one can see.
      const kept = this.watchId === undefined ? undefined : keptWatchPagesDraft(this.watchId);
      const id = this.watchId;
      // A record that is there but unreadable (a newer schema) is not "no
      // pages yet": a start would only meet a conflict.
      // While the iPhone's move may still come it waits, and the start is a
      // small link that asks first.
      const state = this.noRecordState(watches);
      const start = watchRecordUnreadable(record, asWatchPagesDocument)
        ? html`<span>${PAGES_UNREADABLE_TEXT}</span>`
        : html`<b>No pages from this watch yet.</b><span>${noRecordText(state, PAGES_NO_RECORD_TEXT)}</span>
          ${state === "wait"
            ? html`<button class="link start-fresh" ?disabled=${this.starting || id === undefined}
                @click=${() => this.askStartEmptyPage(state)}>${this.starting ? "Starting…" : START_FRESH_BUTTON}</button>`
            : html`<button class="pe-btn pe-primary" ?disabled=${this.starting || id === undefined}
                @click=${() => this.askStartEmptyPage(state)}>${this.starting ? "Starting…" : PAGES_START_BUTTON}</button>`}`;
      return html`<div class="pe-empty">${start}
        ${kept?.dirty && id !== undefined ? html`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when Home Assistant holds pages for this watch again.</span>
          <button class="pe-btn" @click=${() => { forgetWatchPagesDraft(id); this.requestUpdate(); }}>Discard the kept edits</button>` : nothing}
      </div>`;
    }
    const document = draft.document;
    const listed = listedWatchPages(document);
    const pages = watchPagesOf(document);
    const page = this.currentPage();
    const owner = watches.find((w) => w.owner_watch_id === this.watchId);
    const tile = page === undefined || this.selectedTileId === undefined ? undefined : this.tileOn(page, this.selectedTileId);
    const fit = this.fittedColumns();
    const view = this.hostHeight > 0 ? `--pe-view-h:${this.hostHeight}px;` : "";
    // The complication editor's three columns (`editor-chrome.ts`): the
    // Pages and Tiles cards, the canvas card, and the inspector, with a
    // drag gutter between each pair. Unlike there, the editor scrolls as a
    // whole and the side columns stick under the top bar.
    return html`<div class="layout pe-layout ${this.stacked ? "cols-1" : "cols-3"}" style=${`--wa-left:${fit.left}px;--wa-right:${fit.right}px;${view}`}>
      <div class="column left">
        ${this.renderPageList(listed, pages, owner)}
        ${this.renderTileList(page, pages, owner)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${page ? this.renderStage(page, pages, owner, watches, tile) : html`<div class="card canvas-card pe-no-page">
            <p class="pe-muted">${listed.length === 0 ? "Add a page to start." : "Pick a page."}</p>
          </div>`}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${page ? this.renderInspector(page, tile, pages) : nothing}
      </div>
    </div>
    ${this.renderFoot(record, document, draft.dirty)}`;
  }

  /** An iPhone with no pages: a phone starts with none, and nothing is
   * copied to it by itself. Add page starts its pages with one empty page
   * (the first record, or one more in a record that lists none); Copy from
   * watch fills them from a watch. A record already there keeps its foot
   * bar, so an earlier save can still be put back. */
  private renderPhoneEmpty(record: WatchConfigRecord, draft: WatchPagesDraft | undefined): TemplateResult {
    const id = this.watchId;
    const first = record.revision <= 0;
    const kept = first && id !== undefined ? keptWatchPagesDraft(id) : undefined;
    const sources = this.copySources;
    const off = this.starting || this.copying || this.busy;
    return html`<div class="pe-empty pe-phone-empty">
        <b>No pages on this iPhone yet.</b>
        <span>${PHONE_PAGES_EMPTY_TEXT}</span>
        <span class="pe-empty-actions">
          <button class="pe-btn pe-primary pe-add-first" ?disabled=${off || id === undefined}
            @click=${() => (first ? void this.startEmptyPage() : this.addPage())}>${uiIcon("plus")}<span>${this.starting ? "Adding…" : "Add page"}</span></button>
          <button class="pe-btn pe-copy-open" ?disabled=${off || sources.length === 0}
            title=${sources.length === 0 ? "No watch has connected yet" : "Copy one page or all pages from a watch"}
            @click=${() => this.openCopy()}>Copy from watch</button>
        </span>
        ${kept?.dirty && id !== undefined ? html`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when Home Assistant holds pages for this iPhone again.</span>
          <button class="pe-btn" @click=${() => { forgetWatchPagesDraft(id); this.requestUpdate(); }}>Discard the kept edits</button>` : nothing}
      </div>
      ${first || draft === undefined ? nothing : this.renderFoot(record, draft.document, draft.dirty)}`;
  }

  /** The Copy from watch question: the watch to copy from (when there are
   * several), then all pages or one page, each with what comes along. */
  private renderCopyAsk(ask: CopyAsk): TemplateResult {
    const sources = this.copySources;
    const source = sources.find((w) => w.owner_watch_id === ask.watch);
    const listed = ask.pages === undefined ? [] : listedWatchPages(ask.pages);
    const blocked = this.copyBlocked(ask);
    const choose = (scope: CopyAsk["scope"]) => { if (this.copyAsk !== undefined) this.copyAsk = { ...this.copyAsk, scope }; };
    const option = (scope: CopyAsk["scope"], name: string, sub: string) => html`<label class="pe-check pe-copy-opt">
        <input type="radio" name="pe-copy-scope" .checked=${live(ask.scope === scope)} ?disabled=${this.copying}
          @change=${() => choose(scope)} />
        <span class="pe-copy-l"><b>${name}</b>${sub === "" ? nothing : html`<span class="pe-muted">${sub}</span>`}</span>
      </label>`;
    let body: TemplateResult;
    if (ask.watch === undefined) body = html`<p class="pe-muted">No watch has connected to this Home Assistant yet.</p>`;
    else if (ask.state === "loading") body = html`<p class="pe-muted">Reading the watch's pages…</p>`;
    else if (ask.state === "error") body = html`<p class="pe-warn">Could not read the watch's pages: ${ask.error ?? ""}</p>`;
    else if (listed.length === 0) body = html`<p class="pe-muted">This watch has no pages to copy.</p>`;
    else {
      body = html`<div class="pe-copy-list" role="radiogroup" aria-label="What to copy">
          ${option("all", "All pages", `${plural(listed.length, "page", "pages")}, with the watch's status pages, menus and rooms`)}
          ${listed.map((page) => {
            const pageId = watchPageId(page);
            const reach = phoneCopyReach(ask.pages!, pageId);
            const linked = reach.pageIds.length - 1;
            const along = [
              linked > 0 ? plural(linked, "page it links to", "pages it links to") : undefined,
              reach.statusPageIds.length > 0 ? "the status pages it opens" : undefined,
            ].filter((w): w is string => w !== undefined);
            return option(pageId, watchPageName(page), along.length === 0 ? "" : `With ${along.join(" and ")}`);
          })}
        </div>
        <p class="pe-muted">${ask.scope === "all"
          ? "The watch's pages and status pages are added after the iPhone's own. Its menus and rooms take the place of the iPhone's."
          : "The page is added after the iPhone's own pages, with what it links to."}
          Everything copied gets new ids, so the iPhone and the watch never share a page. The watch is not changed.</p>`;
    }
    return html`<dialog class="pe-ask pe-copy" aria-labelledby="pe-copy-title"
      @cancel=${(e: Event) => { if (this.copying) e.preventDefault(); }}
      @close=${() => { if (!this.copying) this.copyAsk = undefined; }}>
      <h3 id="pe-copy-title">Copy from watch</h3>
      ${sources.length > 1 ? html`<div class="pe-copy-from" role="radiogroup" aria-label="Watch to copy from">
          ${sources.map((w) => html`<label class="pe-check">
            <input type="radio" name="pe-copy-watch" .checked=${live(w.owner_watch_id === ask.watch)} ?disabled=${this.copying}
              @change=${() => this.pickCopyWatch(w.owner_watch_id)} />
            <span>${watchName(w, sources)}</span>
          </label>`)}
        </div>`
        : source === undefined ? nothing : html`<p>From <b>${watchName(source, sources)}</b>.</p>`}
      ${body}
      ${blocked !== undefined && (this.draft?.dirty ?? false) ? html`<p class="pe-warn">${blocked}</p>` : nothing}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.copying} @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary pe-copy-go" ?disabled=${blocked !== undefined || this.copying}
          title=${blocked ?? "Copy onto this iPhone"} @click=${() => void this.runCopy()}>${this.copying ? "Copying…" : "Copy"}</button>
      </div>
    </dialog>`;
  }

  /** The inspector's line with no tile selected, the complication editor's
   * `insp-note`: on a smart page under its Rules cards, on any other page
   * the inspector's only card, pointing at the page strip. */
  private renderNoTileCard(page: WatchPage): TemplateResult {
    return html`<p class="insp-note pe-no-tile">${isSmartWatchPage(page)
      ? "A smart page fills itself from its rules, set above."
      : "Select a tile to edit it, or add one. The page's own settings are above the watch."}</p>`;
  }

  // ── the foot bar ───────────────────────────────────────────────────────

  /** The stored copy's line, History and Raw configuration, pinned to the
   * foot of the editor (`config-foot.ts`), with the two dialogs they open. */
  private renderFoot(record: WatchConfigRecord, document: WatchPagesDocument, dirty: boolean): TemplateResult {
    const status = configFootStatus({ record, size: sizeOf(document), limit: WATCH_PAGES_LIMIT_BYTES, noun: "pages", historyState: this.historyState });
    const watchId = this.watchId;
    return html`${renderConfigFoot({
      status,
      historyState: this.historyState,
      historyOpen: this.historyOpen,
      rawOpen: this.rawOpen,
      onHistory: () => { this.historyOpen = true; },
      onRaw: () => { this.rawCopied = false; this.rawOpen = true; },
    })}
    ${this.historyOpen ? renderConfigHistoryDialog({
      noun: "pages",
      record,
      entries: this.history,
      historyState: this.historyState,
      dirty,
      restoring: this.restoring,
      onRetry: () => {
        if (watchId === undefined) return;
        this.historyState = "loading";
        void this.loadHistory(watchId);
      },
      // The restore question takes over from the list.
      onRestore: (entry) => { this.historyOpen = false; this.askRestore(entry); },
      onClosed: () => { this.historyOpen = false; },
    }) : nothing}
    ${this.rawOpen ? renderConfigRawDialog({
      noun: "pages",
      document,
      revision: record.revision,
      dirty,
      copied: this.rawCopied,
      onCopy: (text) => { void copyConfigText(text).then((ok) => { this.rawCopied = ok; }); },
      onClosed: () => { this.rawOpen = false; },
    }) : nothing}`;
  }

  // ── the page list ──────────────────────────────────────────────────────

  /** The watch's screen in points: its case, else the reference case. */
  private screenOf(owner: OwnerSummary | undefined): { width: number; height: number } {
    // An iPhone is drawn in the reference watch's frame, as on the stage.
    if (this.onPhone) return REFERENCE_CASE.screen;
    return (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).screen;
  }

  /** What a picture of `page` is drawn with at `scale`, the stage's own
   * states, symbols and renders. */
  private previewInput(page: WatchPage, pages: readonly WatchPage[], screen: { width: number; height: number }, scale: number): WatchPagePreviewInput {
    return {
      page, pages, screen, states: this.previewStates(), icons: this.icons, scale, catalog: this.pickerCatalog, templates: this.templateRenders,
      behavior: this.behavior, stateMode: this.liveStates ? "live" : "all-on", testedIds: this.testedIds(), photo: this.photoUrl,
    };
  }

  /** The Pages card, the complication editor's left card: a tinted header
   * with + Add, then a row per page with a small picture of its top. */
  private renderPageList(listed: readonly WatchPage[], pages: readonly WatchPage[], owner: OwnerSummary | undefined): TemplateResult {
    const allHidden = listed.length > 0 && listed.every(isHiddenWatchPage);
    const drag = this.rowDrag?.started ? this.rowDrag : undefined;
    const screen = this.screenOf(owner);
    return html`<section class="card lc pe-pages-card ${this.saving ? "saving" : ""}" aria-label="Pages"
      style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${THUMB_W}px; --thumb-h: ${THUMB_H}px`}>
      <div class="lc-head">
        <span class="swatch">${uiIcon("pages")}</span><span class="lc-title">Pages</span>
        <span class="lc-sub">${plural(listed.length, "page", "pages")}</span>
        <span class="spacer"></span>
        <button class="lc-btn pri" ?disabled=${this.saving} title=${this.saving ? SAVING_TEXT : "Add an empty page after the last one"}
          @click=${() => this.addPage()}>${uiIcon("plus")}<span>Add</span></button>
      </div>
      ${listed.length === 0 ? html`<div class="lc-note">This watch has no pages.</div>` : nothing}
      ${allHidden ? html`<div class="lc-note warn">Every page is hidden, so the watch shows "No pages".</div>` : nothing}
      <div class="layers pe-page-list" role="list">
        ${repeat(listed, (p) => watchPageId(p), (p, i) => this.renderPageRow(p, i, listed.length, pages, screen))}
        ${drag ? html`<div class="pe-drop-line" style=${`top:${drag.lineY}px`} aria-hidden="true"></div>` : nothing}
      </div>
    </section>`;
  }

  /** A page's top as a 44 by 22 picture: its background and the tiles that
   * reach into that strip, at the scale that fits the screen's width. A
   * smart page, which fills itself, shows its glyph instead. */
  private renderPageThumb(page: WatchPage, pages: readonly WatchPage[], screen: { width: number; height: number }): TemplateResult {
    if (isSmartWatchPage(page)) {
      return html`<span class="thumb pe-thumb pe-thumb-smart" style=${`background:${watchScreenColor(page)}`} aria-hidden="true">${uiIcon("states")}</span>`;
    }
    const s = THUMB_W / screen.width;
    const layout = watchPreviewLayout(page, screen);
    const input = this.previewInput(page, pages, screen, s);
    // Only what reaches into the strip: a long page costs no more than a short one.
    const shown = layout.tiles.filter((t) => (layout.topInset + t.y) * s < THUMB_H);
    const back = watchScreenLayers(page, s, screen, this.photoUrl);
    return html`<span class="thumb pe-thumb" style=${`background:${back.background}`} aria-hidden="true">
      ${back.layers}
      ${shown.map((t) => html`<span class="pe-thumb-tile"
        style=${`left:${t.x * s}px;top:${(layout.topInset + t.y) * s}px;width:${t.width * s}px;height:${t.height * s}px`}>${renderWatchTileFace(t.tile, { width: t.width, height: t.height }, input, layout.unit)}</span>`)}
    </span>`;
  }

  /** One page as a row of the complication editor's lists: the picture, the
   * name over its tile count, the smart and hidden badges, and on hover the
   * hide switch and the ··· menu (Rename, Move up, Move down, Delete). The
   * whole row drags to reorder with a mouse, the grip with a finger. */
  private renderPageRow(page: WatchPage, index: number, count: number, pages: readonly WatchPage[], screen: { width: number; height: number }): TemplateResult {
    const id = watchPageId(page);
    const on = sameWatchId(id, this.selectedPageId);
    const smart = isSmartWatchPage(page);
    const hidden = isHiddenWatchPage(page);
    const tiles = watchPageTiles(page).length;
    const name = watchPageName(page);
    const renaming = this.renaming !== undefined && sameWatchId(this.renaming.pageId, id) ? this.renaming : undefined;
    const menu = this.menuPageId !== undefined && sameWatchId(this.menuPageId, id);
    const dragging = this.rowDrag?.started === true && sameWatchId(this.rowDrag.pageId, id);
    const own = pressedRowControl;
    const detail = smart ? "Smart page" : `${plural(tiles, "tile", "tiles")} · ${plural(watchPageExtent(page), "row", "rows")}`;
    return html`<div class="layer pe-page-row ${on ? "hl" : ""} ${hidden ? "dim" : ""} ${dragging ? "pe-dragging" : ""} ${menu ? "menu-open" : ""}"
      data-page=${id} role="listitem" tabindex="0" aria-current=${on ? "true" : "false"} aria-label=${name}
      title=${this.saving ? `${SAVING_TEXT} Double click to rename.` : "Double click to rename. Drag, or Alt and the arrow keys, to move the page."}
      @click=${(e: Event) => { if (own(e)) return; if (on) this.selectTile(undefined); else this.selectPage(id); }}
      @dblclick=${(e: Event) => { if (!own(e)) this.startRename(id); }}
      @keydown=${(e: KeyboardEvent) => this.onRowKeyDown(e, id, index, count)}
      @pointerdown=${(e: PointerEvent) => this.onRowPointerDown(e, id, index)}>
      <span class="grip" title=${this.saving ? SAVING_TEXT : "Drag to move"} aria-hidden="true">${uiIcon("grip")}</span>
      ${this.renderPageThumb(page, pages, screen)}
      <span class="name">
        ${renaming
          ? html`<input class="pe-rename" aria-label="Page name" .value=${renaming.value}
              @input=${(e: InputEvent) => { renaming.value = (e.target as HTMLInputElement).value; }}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter") { e.preventDefault(); this.commitRename(); this.focusPageRow = id; }
                else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); this.cancelRename(); }
              }}
              @blur=${() => this.commitRename()} />`
          : html`<b><span class="nm-t">${name}</span></b>`}
        <small>${detail}</small>
      </span>
      <span class="right">
        <span class="badges">
          ${smart ? html`<span class="badge pe-smart">smart</span>` : nothing}
          ${hidden ? html`<span class="badge">hidden</span>` : nothing}
        </span>
        <span class="acts">
          <button type="button" class="icon ${hidden ? "off" : ""}" title=${hidden ? "Hidden on the watch. Show it" : "Shown on the watch. Hide it"}
            aria-label=${hidden ? `Show ${name} on the watch` : `Hide ${name} on the watch`}
            @click=${() => this.setHidden(id, !hidden)}>${uiIcon(hidden ? "hide" : "show")}</button>
          <button type="button" class="icon pe-more" title="More" aria-label=${`More for ${name}`}
            aria-haspopup="menu" aria-expanded=${menu ? "true" : "false"}
            @click=${() => {
              this.menuPageId = menu ? undefined : id;
              this.focusMenu = !menu;
            }}>${uiIcon("more")}</button>
        </span>
      </span>
      ${menu ? html`<div class="pop-menu pe-menu" role="menu" aria-label=${name}>
          <button class="row" role="menuitem" @click=${() => this.startRename(id)}>Rename</button>
          <button class="row" role="menuitem" ?disabled=${index === 0} @click=${() => this.movePage(id, index - 1, true)}>Move up</button>
          <button class="row" role="menuitem" ?disabled=${index >= count - 1} @click=${() => this.movePage(id, index + 1, true)}>Move down</button>
          <button class="row pe-danger" role="menuitem" @click=${() => this.askDelete(id)}>Delete…</button>
        </div>` : nothing}
    </div>`;
  }

  /** The Tiles card, the complication editor's Layers card: the shown page's
   * tiles in reading order (by row, then column), each with its face, its
   * label over its kind and size, and badges for state rules and a tap of its
   * own. A row selects its tile; on hover it copies or deletes it, and the
   * stage tints the tile while the pointer is on its row. */
  private renderTileList(page: WatchPage | undefined, pages: readonly WatchPage[], owner: OwnerSummary | undefined): TemplateResult {
    const smart = page !== undefined && isSmartWatchPage(page);
    const off = page === undefined || this.saving || this.editingOff(page);
    const addOff = off || smart;
    const tiles = page === undefined || smart ? [] : tilesInReadingOrder(page);
    let body: TemplateResult;
    if (page === undefined) body = html`<div class="lc-note">Pick a page to see its tiles.</div>`;
    else if (smart) body = html`<div class="lc-note">A smart page fills itself.</div>`;
    else if (tiles.length === 0) body = html`<div class="lc-note">No tiles yet. Add one, or drag one in from another page.</div>`;
    else {
      const screen = this.screenOf(owner);
      const layout = watchPreviewLayout(page, screen, { flat: true });
      // By the tile itself, else by its id: the layout hands back the page's
      // own tile objects, but a copy would still find its size.
      const sizes = new Map<unknown, PlacedWatchTile>();
      for (const t of layout.tiles) {
        sizes.set(t.tile, t);
        const key = tileIdOf(t.tile).toUpperCase();
        if (key !== "" && !sizes.has(key)) sizes.set(key, t);
      }
      const sizeOfTile = (t: WatchPageTile) => sizes.get(t) ?? sizes.get(tileIdOf(t).toUpperCase() || undefined);
      // Unique keys, as the stage's: a repeated or missing id keys by place.
      const seen = new Set<string>();
      const keyOf = (t: WatchPageTile, i: number): string => {
        const key = tileIdOf(t).toUpperCase();
        const unique = key === "" || seen.has(key) ? `#${i}` : key;
        seen.add(unique);
        return unique;
      };
      body = html`<div class="layers pe-tile-list" role="list">
        ${repeat(tiles, keyOf, (t) => this.renderTileRow(page, t, pages, screen, sizeOfTile(t), layout.unit, off))}
      </div>`;
    }
    return html`<section class="card lc pe-tiles-card" aria-label="Tiles"
      style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${THUMB_W}px; --thumb-h: ${THUMB_H}px`}>
      <div class="lc-head">
        <span class="swatch">${uiIcon("layers")}</span><span class="lc-title">Tiles</span>
        <span class="lc-sub">top to bottom</span>
        <span class="spacer"></span>
        <button class="lc-btn pri pe-add-tile" aria-haspopup="dialog" ?disabled=${addOff}
          title=${this.saving ? SAVING_TEXT : smart ? "A smart page fills itself." : page !== undefined && this.editingOff(page) ? "Turn off Watch view to add a tile." : "Add a tile to this page"}
          @click=${() => this.openAddTile()}>${uiIcon("plus")}<span>Add</span></button>
      </div>
      ${body}
    </section>`;
  }

  private renderTileRow(
    page: WatchPage,
    tile: WatchPageTile,
    pages: readonly WatchPage[],
    screen: { width: number; height: number },
    placed: PlacedWatchTile | undefined,
    unit: number,
    off: boolean,
  ): TemplateResult {
    const id = tileIdOf(tile);
    const entityId = tileEntityId(tile);
    const kindLabel = tileKindLabel(tileKind(entityId));
    const label = watchPreviewTileLabel(tile, { states: this.previewStates(), pages, catalog: this.pickerCatalog }) || kindLabel;
    const rect = watchTileRect(tile);
    // Lit while picked, alone or with others; `aria-current` is the primary's.
    const picked = this.isPicked(id);
    const primary = id !== "" && sameWatchId(id, this.selectedTileId);
    const inMulti = picked && this.multiPicked;
    // The row of the tile under the pointer on the stage: the chrome's accent
    // outline, apart from the selection's fill.
    const peek = id !== "" && sameWatchId(id, this.stageHoverTileId);
    const rules = tileHasStateRules(tile);
    const tap = tileHasTapAction(tile);
    const color = watchKindColor(entityId, watchAddThemeOf(page)) ?? SECTION_COLOR.content;
    const pick = (e: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean }) => {
      if (id === "") return;
      this.clickTile(id, e);
      this.revealTile = true;
      this.inspectorToTop = true;
    };
    const dupRefusal = id === "" ? "This tile cannot be copied." : this.duplicateRefusal(page, tile);
    return html`<div class="layer pe-tile-row ${picked ? "hl" : ""} ${peek ? "peek" : ""} ${id === "" ? "dim" : ""} ${inMulti ? "multi" : ""}" data-row-tile=${id}
      style=${`--k:${color}`} role="listitem" tabindex=${id === "" ? "-1" : "0"} aria-current=${primary ? "true" : "false"}
      aria-label=${label !== kindLabel ? `${label}, ${kindLabel}` : kindLabel}
      title=${[label, kindLabel, entityId].filter((t, i, all) => t !== "" && all.indexOf(t) === i).join(" · ")}
      @click=${(e: MouseEvent) => { if (!pressedRowControl(e)) pick(e); }}
      @keydown=${(e: KeyboardEvent) => {
        if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
        e.preventDefault();
        pick(e);
      }}
      @pointerenter=${() => this.peekTile(id, true)}
      @pointerleave=${() => this.peekTile(id, false)}>
      <span class="grip" aria-hidden="true"></span>
      ${this.renderTileThumb(page, tile, pages, screen, placed, unit)}
      <span class="name">
        <b><span class="nm-t">${label}</span></b>
        <small><span class="kind">${kindLabel}</span> · ${rect.colSpan}×${rect.rowSpan}</small>
      </span>
      <span class="right">
        <span class="badges">
          ${rules ? html`<span class="badge states" title="Other icons or colors in some states">rules</span>` : nothing}
          ${tap ? html`<span class="badge tap" title="A tap of its own">action</span>` : nothing}
        </span>
        ${id === "" ? nothing : html`<span class="acts">
          <button type="button" class="icon" ?disabled=${dupRefusal !== undefined} title=${dupRefusal ?? "Duplicate"} aria-label=${`Duplicate ${label}`}
            @click=${() => this.duplicateTile(id)}>${uiIcon("duplicate")}</button>
          <button type="button" class="icon danger" ?disabled=${off} title=${this.saving ? SAVING_TEXT : "Delete"} aria-label=${`Delete ${label}`}
            @click=${() => this.deleteTile(id)}>${uiIcon("delete")}</button>
        </span>`}
      </span>
    </div>`;
  }

  /** A tile's face in the 44 by 22 thumb, at the largest scale that fits,
   * centred on the page's screen color. */
  private renderTileThumb(
    page: WatchPage,
    tile: WatchPageTile,
    pages: readonly WatchPage[],
    screen: { width: number; height: number },
    placed: PlacedWatchTile | undefined,
    unit: number,
  ): TemplateResult {
    const bg = `background:${watchScreenColor(page)}`;
    if (placed === undefined || placed.width <= 0 || placed.height <= 0) return html`<span class="thumb pe-thumb" style=${bg} aria-hidden="true"></span>`;
    const s = Math.min(THUMB_W / placed.width, THUMB_H / placed.height);
    const w = placed.width * s;
    const h = placed.height * s;
    const input = this.previewInput(page, pages, screen, s);
    return html`<span class="thumb pe-thumb" style=${bg} aria-hidden="true">
      <span class="pe-thumb-tile" style=${`left:${(THUMB_W - w) / 2}px;top:${(THUMB_H - h) / 2}px;width:${w}px;height:${h}px`}>${renderWatchTileFace(tile, { width: placed.width, height: placed.height }, input, unit)}</span>
    </span>`;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  /** The stage's scale now: as stepped, else the fit for the width. */
  private get stageScale(): number {
    return this.zoom ?? stageFitZoom(this.narrow || this.stacked);
  }

  private setZoom(scale: number | undefined): void {
    this.zoom = scale;
    saveStageZoom(scale);
    this.cancelGestures();
  }

  /** The Live preview switch: Home Assistant's real states, or every tile
   * drawn on. A state tried in the Live strip shows either way. */
  private setLive(on: boolean): void {
    this.liveStates = on;
    saveStageLive(on);
  }

  /** Home Assistant's states as the previews draw them: the real ones, with
   * each test state from the Live strip standing in for its entity's, and the
   * state chip under the pointer over those. The tile settings read
   * `this.hass` itself, never this. */
  private previewStates(): Record<string, HassEntityState> | undefined {
    const states = this.hass?.states;
    const hover = this.hoverState;
    if (this.testStates.size === 0 && hover === undefined) return states;
    const out: Record<string, HassEntityState> = { ...states };
    const tried: [string, string][] = [...this.testStates];
    if (hover !== undefined) tried.push([hover.entityId, hover.state]);
    for (const [id, value] of tried) {
      const entity = states?.[id];
      out[id] = entity !== undefined
        ? { ...entity, state: value }
        : { entity_id: id, state: value, attributes: {}, last_changed: "", last_updated: "" };
    }
    return out;
  }

  /** The entities `previewStates` draws in a tried state (pinned or under
   * the pointer), which the all-on picture leaves as tried. */
  private testedIds(): ReadonlySet<string> | undefined {
    const hover = this.hoverState?.entityId;
    if (this.testStates.size === 0 && hover === undefined) return undefined;
    const ids = new Set(this.testStates.keys());
    if (hover !== undefined) ids.add(hover);
    return ids;
  }

  /** Try a state for one entity in the previews, or go back to its live
   * state with undefined or an empty value. It shows whether Live preview is
   * on or off. With Live preview on, the live state itself is no test; off,
   * the tile would draw lit without it, so it stays. */
  private setTestValue(id: string, raw: string | undefined): void {
    const v = raw?.trim() ?? "";
    const next = new Map(this.testStates);
    if (v === "" || (this.liveStates && v === this.hass?.states?.[id]?.state)) next.delete(id);
    else next.set(id, v);
    this.testStates = next;
  }

  private commitTestValue(id: string, raw: string): void {
    this.editingValue = undefined;
    this.setTestValue(id, raw);
  }

  /**
   * The canvas card, the complication editor's: the head (the page's name,
   * the watch tabs, the page's facts, then Undo, Redo, Duplicate and Delete
   * for the selected tile), the page strip with the page's own settings, the
   * dotted stage with the floating tool strip over the watch, the hint under
   * it, and the Live strip at its foot.
   */
  private renderStage(
    page: WatchPage,
    pages: readonly WatchPage[],
    owner: OwnerSummary | undefined,
    watches: readonly OwnerSummary[],
    tile: WatchPageTile | undefined,
  ): TemplateResult {
    // An iPhone is drawn in the watch's frame for now, at the reference
    // size, named as the phone (a phone frame is later work).
    const phone = this.onPhone;
    const found = phone ? undefined : caseForScreenSize(owner?.screen_size);
    const watchCase = found ?? REFERENCE_CASE;
    const frame = phone ? phoneFrameLabel(owner === undefined ? "iPhone" : watchName(owner, watches)) : watchCase.label;
    const smart = isSmartWatchPage(page);
    const tiles = watchPageTiles(page).length;
    const rows = watchPageExtent(page);
    const config = readSmartConfig(page);
    // A smart page names itself as the watch does, from its fill.
    const states = this.previewStates();
    const facts = smartStageFacts(page, states) ?? [plural(tiles, "tile", "tiles"), plural(rows, "row", "rows")];
    facts.push(phone ? "watch frame" : watchCase.label);
    if (isHiddenWatchPage(page)) facts.push(phone ? "hidden on the iPhone" : "hidden on the watch");
    const headers = !smart && watchPageHasHeader(page);
    const asOnWatch = headers && this.asOnWatch;
    const scale = this.stageScale;
    const input: WatchPagePreviewInput = {
      page, pages, screen: watchCase.screen, states, icons: this.icons, scale, catalog: this.pickerCatalog, templates: this.templateRenders,
      // The watch's own settings, for its page dots and its page title mode.
      behavior: this.behavior,
      // Live off: every tile lit, as the page looks in use, but for a state
      // being tried in the Live strip. A smart page is always live.
      stateMode: this.liveStates ? "live" : "all-on",
      testedIds: this.testedIds(),
    };
    if (config !== undefined) {
      // The selected rule's tiles draw full, the rest faint; a click on a
      // tile selects its rule.
      input.smart = {
        rule: smartSelectedRuleIndex(config, this.selectedSmartRuleId),
        pick: (index: number) => {
          const id = config.rules[index]?.id;
          if (id !== undefined && id !== "") this.selectedSmartRuleId = id;
        },
      };
    }
    this.stageScreen = watchCase.screen;
    const scrolls = !smart && (asOnWatch ? watchPagePreviewScrolls(page, watchCase.screen) : this.editStage(page, input).scrolls);
    const hint = smart ? undefined
      : asOnWatch ? "Shown as the watch draws it. Turn off Watch view to edit."
      : tiles === 0 ? "No tiles yet. Add one from the Tiles list."
      : "Drag a tile to move it, or onto another tile to swap the two. Drag an edge or the corner of the selected tile to resize it. Arrow keys move the selected tile.";
    return html`<div class="card canvas-card pe-canvas ${this.pageStripOpen === undefined ? "" : "pe-pop-open"}" aria-label="Page">
      ${this.renderCanvasHead(page, watches, facts, phone ? PHONE_FRAME_TEXT : found === undefined ? `${watchCase.label}, this watch's size is not known` : undefined, tile)}
      ${this.renderPageStrip(page)}
      <div class="stage-area pe-stage-area">
        ${this.renderStageTools(page, frame, headers, smart, phone)}
        <div class="pe-stage-body">
          ${smart || asOnWatch ? renderWatchPagePreview(input) : this.renderEditScreen(page, input)}
        </div>
        ${scrolls || hint !== undefined ? html`<div class="under">
          ${scrolls ? html`<span class="tail pe-fold-text">${WATCH_SCREEN_FOLD_TEXT}</span>` : nothing}
          ${hint !== undefined ? html`<span class="tail ${tiles > 0 && !asOnWatch ? "pe-hint" : ""}">${hint}</span>` : nothing}
        </div>` : nothing}
      </div>
      ${this.renderLiveStrip(page, tile)}
    </div>`;
  }

  /** The canvas head: the page's name, typed over where it stands (the
   * same rename as the page row's), the open watch's name (picked in the
   * top bar), the page's facts, and at the right the edit actions. It reads
   * "Hall / Sim / 6 tiles · 16 rows · 46 mm". */
  private renderCanvasHead(
    page: WatchPage,
    watches: readonly OwnerSummary[],
    facts: readonly string[],
    factsTitle: string | undefined,
    tile: WatchPageTile | undefined,
  ): TemplateResult {
    const id = watchPageId(page);
    const stored = watchPageName(page);
    const draft = this.draft;
    const off = this.busy || this.editingOff(page);
    // With several picked, both act on all of them and say how many.
    const picked = this.multiPicked ? this.pickedIds(page) : [];
    const many = picked.length >= 2 ? `${picked.length} tiles` : undefined;
    const dupRefusal = many !== undefined
      ? (this.copyableCount(page, picked) > 0 ? undefined : "None of these tiles can be copied here.")
      : tile === undefined ? "Select a tile to duplicate it." : this.duplicateRefusal(page, tile);
    const dupLabel = many !== undefined ? `Duplicate ${many}` : "Duplicate the selected tile";
    const delLabel = many !== undefined ? `Delete ${many}` : "Delete the selected tile";
    const current = watches.find((w) => w.owner_watch_id === this.watchId);
    const commit = (input: HTMLInputElement): void => {
      const document = this.draft?.document;
      if (document === undefined) return;
      // A blank name or the same one changes nothing; the stored one shows.
      if (!this.edit(setWatchPageName(document, id, input.value))) input.value = watchPageName(this.currentPage() ?? page);
    };
    return html`<div class="cv-head">
      <label class="tb-name" title="Click the name to rename the page">
        <input type="text" class="tb-name-input" aria-label="Page name" placeholder="Untitled" .value=${stored}
          @change=${(e: Event) => commit(e.target as HTMLInputElement)}
          @keydown=${(e: KeyboardEvent) => {
            const input = e.target as HTMLInputElement;
            if (e.key === "Enter") { e.preventDefault(); input.blur(); }
            if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); input.value = stored; input.blur(); }
          }} />
        <span class="tb-pen" aria-hidden="true">✎</span>
      </label>
      ${current ? html`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
        <span class="cv-shape pe-watch-crumb">${watchName(current, watches)}</span></span>` : nothing}
      <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
        <span class="cv-shape" title=${factsTitle ?? facts.join(" · ")}><span class="fam">${facts.join(" · ")}</span></span></span>
      <span class="cv-acts">
        <button class="cv-act icon undo" ?disabled=${!draft?.canUndo} title=${`Undo (${MOD}Z)`} aria-label="Undo"
          @click=${() => this.undo()}>${uiIcon("undo")}</button>
        <button class="cv-act icon undo" ?disabled=${!draft?.canRedo} title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo"
          @click=${() => this.redo()}>${uiIcon("redo")}</button>
        <span class="cv-div" aria-hidden="true"></span>
        <button class="cv-act icon" ?disabled=${dupRefusal !== undefined} title=${dupRefusal ?? dupLabel} aria-label=${dupLabel}
          @click=${() => this.duplicateTile()}>${uiIcon("duplicate")}</button>
        <button class="cv-act icon danger" ?disabled=${tile === undefined || off}
          title=${tile === undefined ? "Select a tile to delete it." : `${delLabel} (Delete or Backspace)`} aria-label=${delLabel}
          @click=${() => this.deleteTile()}>${uiIcon("delete")}</button>
      </span>
    </div>`;
  }

  /**
   * The page strip under the canvas head: the page's own settings, one chip
   * each (Smart on a smart page, Theme, Background, Title) saying what the
   * page has now, with the changed dot while it holds a value of its own. How
   * the page shows in the page switcher is set in the menu editor. A chip opens
   * a popover under it with that section's rows, one popover at a time, so
   * the page's settings are in reach whatever the inspector shows. Reset page
   * ends the row while it would change something.
   */
  private renderPageStrip(page: WatchPage): TemplateResult {
    // The chips read the page alone; the rows in a popover edit through the
    // host, which waits for Home Assistant.
    const host = this.editorHost(page);
    const id = watchPageId(page);
    const config = readSmartConfig(page);
    // The smart page's own rows (Updates, Tile size, Show labels, Sort
    // order) get a chip on a smart page only; the Smart Page switch itself
    // stands in the strip with Hidden on the watch.
    const smartChip = config === undefined ? nothing : this.renderPageChip({
      section: "page",
      title: "Smart page",
      label: "Smart",
      badge: SMART_SECTION_BADGE,
      value: smartRuleCountWords(config.rules.length),
      dot: false,
      body: () => (host === undefined ? nothing : renderSmartPageBody(host)),
    });
    const sections: Exclude<WatchPageStripSection, "page">[] = ["theme", "background", "title"];
    // The strip reads "Page" then its options, a hairline between
    // each: Hidden first, the chips, then the Smart Page switch (a mode
    // change, so last) and on a smart page its chip.
    // The two switches explain themselves the moment the pointer is on
    // them (`.pe-tip`), not after the native tooltip's wait.
    const hidden = html`<label class="pe-switch pe-pstrip-tog pe-tip"
        data-tip="Hidden: the page stays in the document, but the watch does not show it. Turn it off to show the page again.">
        <input type="checkbox" role="switch" .checked=${live(isHiddenWatchPage(page))} ?disabled=${this.busy}
          @change=${(e: Event) => this.setHidden(id, (e.target as HTMLInputElement).checked)} />
        <span>Hidden</span>
      </label>`;
    const items: TemplateResult[] = [
      hidden,
      ...sections.map((section) => this.renderPageChip({
        section,
        title: WATCH_PAGE_SECTION_TITLES[section],
        label: WATCH_PAGE_CHIP_LABELS[section],
        badge: WATCH_PAGE_SECTION_BADGES[section],
        value: pageSettingSummary(page, section),
        dot: watchPageSectionChanged(page, section),
        body: () => (host === undefined ? nothing : renderPageSettingBody(host, section)),
        ...(section === "theme" ? { theme: watchPageSettings(page).theme } : {}),
      })),
    ];
    if (host !== undefined) {
      items.push(html`<span class="pe-pstrip-tog pe-tip"
        data-tip="Smart Page: the page fills itself from its rules with the entities that are on right now. Turning it on replaces the page's tiles with rules.">${renderSmartPageSwitch(host, { tip: true })}</span>`);
    }
    if (smartChip !== nothing) items.push(smartChip as TemplateResult);
    const sep = html`<span class="pe-pstrip-sep" aria-hidden="true"></span>`;
    return html`<div class="pe-pstrip" role="toolbar" aria-label="Page settings">
      <span class="pe-pstrip-label">Page</span>
      ${items.map((item, i) => (i === 0 ? item : html`${sep}${item}`))}
      ${host === undefined ? nothing : renderPageReset(host)}
    </div>`;
  }

  /** One chip of the page strip and, while it is open, its popover: a head
   * line with the section's name and changed dot, over the section's rows.
   * With `theme` the chip's swatch is the theme's own dot, as in the
   * popover, in place of the section's icon. */
  private renderPageChip(chip: {
    section: WatchPageStripSection;
    title: string;
    label: string;
    badge: WatchSectionBadge;
    value: string;
    dot: boolean;
    body: () => TemplateResult | typeof nothing;
    theme?: string;
  }): TemplateResult {
    const { section, title, label, badge, value } = chip;
    const open = this.pageStripOpen === section;
    const dot = chip.dot ? html`<span class="pe-pchip-dot" aria-hidden="true"></span>` : nothing;
    const swatch = chip.theme !== undefined
      ? html`<span class="pe-pchip-sw pe-pchip-theme" style=${watchPageThemeDot(chip.theme)} aria-hidden="true"></span>`
      : html`<span class="pe-pchip-sw" aria-hidden="true">${uiIcon(badge.icon)}</span>`;
    return html`<div class="pe-pstrip-item" style=${`--k:${badge.color}`}>
      <button type="button" class="pe-pchip" data-section=${section} aria-haspopup="dialog" aria-expanded=${open ? "true" : "false"}
        title=${`${title}: ${value}`} @click=${() => this.togglePageStrip(section)}>
        ${swatch}<span class="pe-pchip-l">${label}</span>${dot}<span class="pe-pchip-v">${value}</span><span class="pe-pchip-chev" aria-hidden="true">▾</span>
      </button>
      ${open ? html`<div class="pop-menu pe-ppop" role="dialog" aria-label=${title}>
        <div class="pe-ppop-h"><span>${title}</span>${dot}</div>
        <div class="sec-b pe-ppop-b">${chip.body()}</div>
      </div>` : nothing}
    </div>`;
  }

  /** The floating tool strip over the stage, the complication editor's:
   * the Live preview switch (with an instant hint saying what off and on
   * draw), the watch's size and its screen color (read only), Watch view on a
   * page with headers, and the zoom. */
  private renderStageTools(page: WatchPage, caseLabel: string, headers: boolean, smart: boolean, phone = false): TemplateResult {
    const sep = html`<span class="tb-sep" aria-hidden="true"></span>`;
    const scale = this.stageScale;
    const fit = stageFitZoom(this.narrow || this.stacked);
    return html`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${smart ? nothing : html`<label class="pe-switch pe-live pe-tip"
          data-tip=${this.liveStates
            ? "Live preview: on. The tiles are drawn with Home Assistant's real states. Turn it off to draw every tile on."
            : "Live preview: off. Every tile is drawn on, as the page looks with everything active. Turn it on to draw the tiles with Home Assistant's real states."}>
          <input type="checkbox" role="switch" .checked=${live(this.liveStates)}
            @change=${(e: Event) => this.setLive((e.target as HTMLInputElement).checked)} />
          <span class="word keep">Live preview</span>
        </label>
        ${sep}`}
      <button class="tb pe-case" aria-disabled="true" tabindex="-1"
        title=${phone ? `${PHONE_FRAME_TEXT} The page's background color beside it.` : `This watch's screen, ${caseLabel}. The page's background color beside it.`}>
        ${uiIcon(phone ? "phone" : "watch")}<span class="word keep">${caseLabel}</span><i class="tint-dot" style=${`--sw:${watchScreenColor(page)}`}></i></button>
      ${headers ? html`${sep}<button class="tb pe-watch-view ${this.asOnWatch ? "lit" : ""}" aria-pressed=${this.asOnWatch ? "true" : "false"}
          title="Headers pull the rows below them up on the watch. Editing is off while this is on."
          @click=${() => { this.asOnWatch = !this.asOnWatch; this.cancelGestures(); }}><span class="word">Watch view</span></button>` : nothing}
      ${sep}
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon pe-zoom-out" ?disabled=${scale <= stageZoomOut(scale)} aria-label="Zoom out" title="Zoom out"
          @click=${() => this.setZoom(stageZoomOut(scale))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${stageZoomLabel(scale)}. Back to fit`}
          title=${`The watch at ${stageZoomLabel(scale)} of its own points. Click to fit it again (${stageZoomLabel(fit)}).`}
          @click=${() => this.setZoom(undefined)}>${stageZoomLabel(scale)}</button>
        <button class="tb icon pe-zoom-in" ?disabled=${scale >= stageZoomIn(scale)} aria-label="Zoom in" title="Zoom in"
          @click=${() => this.setZoom(stageZoomIn(scale))}>+</button>
      </span>
    </div>`;
  }

  /** The Live strip under the stage, the complication editor's values bar,
   * for trying the selected tile's states: its name, then each state its
   * entity can take as a chip (a slider or a typed reading for a number or
   * free text), then a reset while one is kept. The chip under the pointer
   * shows in the previews (the stage, the tile pictures and the rows) as if
   * Home Assistant said so; a click keeps it there until clicked again.
   * Nothing is saved. */
  private renderLiveStrip(page: WatchPage, tile: WatchPageTile | undefined): TemplateResult {
    let body: TemplateResult;
    const picked = this.multiPicked ? this.pickedIds(page).length : 0;
    if (picked >= 2) body = html`<span class="vb-empty">${picked} tiles picked. Pick one to try its states.</span>`;
    else if (tile === undefined) body = html`<span class="vb-empty">Select a tile to try its states here.</span>`;
    else {
      const entityId = tileEntityId(tile);
      const real = entityId === "" ? undefined : this.hass?.states?.[entityId];
      const states = this.previewStates();
      const entity = entityId === "" ? undefined : states?.[entityId];
      const color = watchKindColor(entityId, watchAddThemeOf(page)) ?? SECTION_COLOR.content;
      const symbol = watchTileSymbol(tile, entity);
      const glyph = symbol === undefined ? undefined : this.memoIcons().render(symbol, 13, color);
      const label = watchPreviewTileLabel(tile, { states, pages: this.draft === undefined ? [] : watchPagesOf(this.draft.document), catalog: this.pickerCatalog })
        || tileKindLabel(tileKind(entityId));
      const unit = typeof real?.attributes?.unit_of_measurement === "string" ? ` ${real.attributes.unit_of_measurement}` : "";
      const icon = html`<span class="vp-icon">${glyph ?? uiIcon("states")}</span><b>${label}</b>`;
      if (entityId === "" || isVirtualTileKind(tileKind(entityId))) {
        body = html`<div class="vb-pills"><div class="vchip vpill" style=${`--k:${color}`} title=${entityId}>
          ${icon}<span class="val">No entity</span>
        </div></div>`;
      } else {
        const live = real !== undefined ? `${real.state}${unit}` : "Not in Home Assistant";
        const override = this.testStates.get(entityId);
        const control = testControlFor(entityId, real, override);
        body = html`<div class="vb-pills"><div class="vchip vpill ctl ${control.kind === "choice" ? "pe-states" : ""} ${override !== undefined ? "testing" : ""}"
          style=${`--k:${color}`} title=${override !== undefined ? `Home Assistant's state now: ${live}` : entityId}>
          ${icon}
          ${control.kind === "choice"
            ? this.renderStateChips(entityId, label, control.options, real?.state, override)
            : this.renderTestControl(entityId, label, real, override, unit, live, control)}
          ${override !== undefined
            ? html`<button type="button" class="live-reset" title="Back to Home Assistant's state" aria-label=${`Back to Home Assistant's state for ${label}`}
                @click=${() => { this.editingValue = undefined; this.setTestValue(entityId, undefined); }}>${uiIcon("reset")}</button>`
            : html`<span class="live-reset-slot" aria-hidden="true"></span>`}
        </div></div>`;
      }
    }
    return html`<div class="values-foot"><div class="values-bar" role="group" aria-label="Try the tile's states">${body}</div></div>`;
  }

  /** Every state an entity with a known set of words can take, as a row of
   * chips. The chip the pointer rests on (or that holds focus) shows in the
   * previews while it is there; a click keeps it, and a click on the kept
   * chip lets it go. A dot marks Home Assistant's state now. */
  private renderStateChips(
    id: string,
    name: string,
    options: readonly string[],
    real: string | undefined,
    pinned: string | undefined,
  ): TemplateResult {
    const show = (state: string): void => { this.hoverState = { entityId: id, state }; };
    const hide = (state: string): void => {
      if (this.hoverState?.entityId === id && this.hoverState.state === state) this.hoverState = undefined;
    };
    const pick = (state: string): void => {
      if (state === pinned) {
        this.setTestValue(id, undefined);
        this.hoverState = undefined;
      } else this.setTestValue(id, state);
    };
    return html`<div class="pe-state-chips" role="group" aria-label=${`States to try for ${name}`}>
      ${options.map((o) => {
        const isLive = o === real;
        const on = o === pinned;
        const title = on ? `Kept in the preview. Click to go back to Home Assistant's state.`
          : isLive ? "Home Assistant's state now"
          : "Point here to preview this state, click to keep it";
        return html`<button type="button" class="pe-state-chip ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} title=${title}
          @pointerenter=${() => show(o)} @pointerleave=${() => hide(o)} @focus=${() => show(o)} @blur=${() => hide(o)}
          @click=${() => pick(o)}>${o}${isLive ? html`<i class="pe-state-live" aria-hidden="true"></i>` : nothing}</button>`;
      })}
    </div>`;
  }

  /** The control for the selected tile's test state when its entity has no
   * known set of words, the complication editor's: a slider and its reading
   * for a number, and a reading that opens a box for the rest. */
  private renderTestControl(
    id: string,
    name: string,
    s: HassEntityState | undefined,
    override: string | undefined,
    unit: string,
    live: string,
    control: Exclude<TestControl, { kind: "choice" }>,
  ): TemplateResult {
    const shown = override ?? s?.state ?? "";
    const reading = this.editingValue === id
      ? html`<input type="text" .value=${shown} aria-label=${`Test state for ${name}`}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") { e.stopPropagation(); this.editingValue = undefined; }
          }}
          @blur=${(e: FocusEvent) => { if (this.editingValue === id) this.commitTestValue(id, (e.target as HTMLInputElement).value); }} />`
      : html`<button type="button" class="val" title="Click to type a state"
          @click=${() => { this.editingValue = id; void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>(".vchip input[type=text]")?.focus()); }}>${override !== undefined ? `${override}${unit}` : live}</button>`;
    if (control.kind === "text") return html`<span class="test-ctl">${reading}</span>`;
    const n = Number(shown);
    const at = shown.trim() !== "" && Number.isFinite(n) ? n : control.min;
    return html`<span class="test-ctl">
      <input type="range" min=${control.min} max=${control.max} step=${control.step} .value=${String(at)}
        style=${rangeFill(at, control.min, control.max)}
        aria-label=${`Slide the test state for ${name}`}
        @input=${(e: Event) => this.setTestValue(id, (e.target as HTMLInputElement).value)} />
      ${reading}
    </span>`;
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
    // A pick of several reaches as deep as its lowest tile moved.
    const reach = move?.cell && move.group !== undefined
      ? Math.max(...move.group.map((m) => m.rect.row + moveDelta(move, move.cell!).drows + m.rect.rowSpan))
      : move?.cell ? move.cell.row + move.rect.rowSpan : resize?.preview ? resize.preview.rect.row + resize.preview.rect.rowSpan : 0;
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
    // The preview's own layout on the flat grid: the same side safe area and
    // unit as the watch, so each tile sits where `cellRectPx` puts its cells.
    const layout = watchPreviewLayout(shown, screen, { flat: true });
    const width = screen.width * s;
    const selected = this.selectedTileId;
    const seen = new Set<string>();
    const keyOf = (placed: PlacedWatchTile): string => {
      const id = tileIdOf(placed.tile).toUpperCase();
      const key = id === "" || seen.has(id) ? `#${placed.index}` : id;
      seen.add(key);
      return key;
    };
    // The handles are a single tile's: a pick of several is ringed, not sized.
    const selectedPlaced = selected === undefined || this.multiPicked ? undefined : layout.tiles.find((t) => sameWatchId(t.tile.id, selected));
    const selBox = resize?.preview
      ? cellRectPx(grid, resize.preview.rect)
      : selectedPlaced && !move
        ? cellRectPx(grid, drawnRect(watchTileRect(selectedPlaced.tile)))
        : undefined;
    const back = watchScreenLayers(shown, s, screen, this.photoUrl);
    // The grid's cells show only while a tile is moved or resized.
    return renderWatchFrame(screen, s, html`<div class="wp-screen pe-screen ${this.saving ? "saving" : ""} ${move || resize ? "moving" : ""}" tabindex="-1" role="group" aria-label=${`Layout of ${watchPageName(page)}`}
      style=${`width:${width}px;height:${height}px;background:${back.background}`}
      @click=${() => this.selectTile(undefined)}>
      ${back.layers}
      ${renderWatchClock(screen, s, layout.topInset, input.icons)}
      ${renderWatchPageTitle(shown, s, layout.topInset, input.icons, input.behavior)}
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
    </div>`, `Watch showing ${watchPageName(page)}`);
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
    const label = watchPreviewTileLabel(tile, input);
    // Every picked tile wears the ring; one of a pick of several also takes
    // `multi`.
    const selected = this.isPicked(id);
    const inMulti = selected && this.multiPicked;
    // Tinted while its row, or the tile itself, is under the pointer; not
    // while a tile is being dragged, when the ghosts say what will happen.
    const hovered = id !== "" && move === undefined && (sameWatchId(id, this.rowHoverTileId) || sameWatchId(id, this.stageHoverTileId));
    const grabbed = move !== undefined && sameWatchId(id, move.tileId);
    // A pick of several follows the pointer together: each picked tile
    // shifts as far as the grabbed one has from its own place.
    const follower = !grabbed && move?.group !== undefined && id !== "" && move.group.some((m) => sameWatchId(m.id, id));
    const moving = grabbed || follower;
    const partner = move?.outcome?.kind === "swap" && sameWatchId(id, move.outcome.targetId);
    let shift = "";
    if (grabbed) shift = `transform:translate(${move.left - left}px, ${move.top - top}px);`;
    else if (follower) {
      const from = cellRectPx(grid, drawnRect(move.rect));
      shift = `transform:translate(${move.left - from.left}px, ${move.top - from.top}px);`;
    }
    const face = renderWatchTileFace(tile, { width: width / s, height: height / s }, input, unit);
    // The ring of a selected tile follows the tile's own corners, which are
    // the watch's (`watchTileCornerRadius`).
    const radius = watchTileCornerRadius(width / s, height / s) * s;
    const box = `left:${left}px;top:${top}px;width:${width}px;height:${height}px;border-radius:${radius}px;${shift}`;
    // A tile with no id cannot be named by an edit; it is drawn and left be.
    if (id === "") return html`<div class="pe-tile fixed ${tileKind(tileEntityId(tile)) === "spacer" ? "spacer" : ""}" style=${box} aria-hidden="true">${face}</div>`;
    const spacer = tileKind(tileEntityId(tile)) === "spacer";
    return html`<button type="button" class="pe-tile ${spacer ? "spacer" : ""} ${selected ? "sel" : ""} ${hovered ? "hov" : ""} ${moving ? "moving" : ""} ${partner ? "partner" : ""} ${inMulti ? "multi" : ""}"
      data-tile=${id} style=${box}
      aria-label=${label !== "" && label !== kindLabel ? `${label}, ${kindLabel}` : kindLabel} aria-pressed=${selected ? "true" : "false"}
      title=${[label, kindLabel, tileEntityId(tile), this.saving ? SAVING_TEXT : ""].filter((t, i, all) => t !== "" && all.indexOf(t) === i).join(" · ")}
      @pointerdown=${(e: PointerEvent) => this.onTilePointerDown(e, id)}
      @pointerenter=${() => this.peekStageTile(id, true)}
      @pointerleave=${() => this.peekStageTile(id, false)}
      @click=${(e: MouseEvent) => {
        e.stopPropagation();
        if (this.swallowTileClick) {
          this.swallowTileClick = false;
          return;
        }
        this.clickTile(id, e);
      }}>${face}</button>`;
  }

  /** Where a drop would put the tile: the target place, green for a move,
   * accent for a swap with where the other tile goes, red when refused. */
  private renderMoveGhosts(move: MoveGesture, page: WatchPage, grid: StageGrid): TemplateResult | typeof nothing {
    const outcome = move.outcome;
    if (outcome === undefined || outcome.kind === "same") return nothing;
    const box = (b: { left: number; top: number; width: number; height: number }) =>
      `left:${b.left}px;top:${b.top}px;width:${b.width}px;height:${b.height}px`;
    const kind = outcome.kind === "none" ? "no" : outcome.kind === "swap" ? "swap" : "ok";
    if (move.group !== undefined) {
      // One ghost per picked tile, at its own place moved by the grabbed
      // tile's delta; held inside the columns, so a refused aim off the side
      // never widens the card.
      const { dcols, drows } = moveDelta(move, outcome.cell);
      return html`${move.group.map((m) => {
        const col = Math.max(0, Math.min(WATCH_GRID_COLUMNS - m.rect.colSpan, m.rect.col + dcols));
        const row = Math.max(0, m.rect.row + drows);
        return html`<div class="pe-ghost ${kind}" data-ghost-tile=${m.id} style=${box(cellRectPx(grid, { col, row, colSpan: m.rect.colSpan, rowSpan: m.rect.rowSpan }))}></div>`;
      })}`;
    }
    const at = cellRectPx(grid, { ...outcome.cell, colSpan: move.rect.colSpan, rowSpan: move.rect.rowSpan });
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

  // ── the inspector ──────────────────────────────────────────────────────

  /**
   * The inspector column, the complication editor's: a sticky head with the
   * breadcrumb (the page, then the selected tile's kind chip and name; the
   * page's name is the way back from the tile to the page) and Collapse all,
   * then the cards. With a tile selected they are the tile's
   * (`renderTileCard`); with none, on a smart page its Rules cards
   * (`renderRulesCard`), then a line saying where the page's own settings
   * are (the page strip over the watch) and Delete page.
   */
  private renderInspector(page: WatchPage, tile: WatchPageTile | undefined, pages: readonly WatchPage[]): TemplateResult {
    const name = watchPageName(page);
    const picked = this.multiPicked ? this.pickedIds(page) : [];
    if (picked.length >= 2) {
      return html`
        <div class="insp-head">
          <div class="crumbs"><button class="root" title="Edit the page" @click=${() => this.selectTile(undefined)}>${name}</button><span class="sep">›</span><span class="kchip" style=${`--k:${WATCH_PAGE_CHIP_COLOR}`}>${picked.length} tiles</span></div>
        </div>
        <div class="insp-body">${this.renderPickedCard(page, picked, pages)}</div>`;
    }
    const host = this.editorHost(page);
    const tileHost = tile === undefined ? undefined : this.tileSettingsHost(page, tile);
    let crumbs: TemplateResult;
    if (tile === undefined) {
      crumbs = html`<div class="crumbs"><span class="kchip" style=${`--k:${WATCH_PAGE_CHIP_COLOR}`}>${isSmartWatchPage(page) ? "Smart page" : "Page"}</span><span class="nm" title=${name}>${name}</span></div>`;
    } else {
      const kind = tileKind(tileEntityId(tile));
      const kindLabel = tileKindLabel(kind);
      const label = watchPreviewTileLabel(tile, { states: this.hass?.states, pages, catalog: this.pickerCatalog }) || kindLabel;
      crumbs = html`<div class="crumbs"><button class="root" title="Edit the page" @click=${() => this.selectTile(undefined)}>${name}</button><span class="sep">›</span><span class="kchip" style=${`--k:${watchTileKindColor(kind)}`}>${kindLabel}</span><span class="nm" title=${label}>${label}</span></div>`;
    }
    // Every card drawn now that folds, for Collapse all: it folds them all
    // while one is open, else opens them all, through the fold memory.
    const folds: FoldId[] = tile === undefined
      ? (host === undefined ? [] : smartFoldIds(host))
      : (tileHost === undefined ? [] : tileSettingsFoldIds(tileHost, tileInspectorSections(tileHost)));
    const anyOpen = anySectionOpen(this.uiState, folds);
    const id = watchPageId(page);
    return html`
      <div class="insp-head">
        ${crumbs}
        ${folds.length === 0 ? nothing : html`<button class="expand" @click=${() => { setSectionsOpen(this.uiState, folds, !anyOpen); this.requestUpdate(); }}>${anyOpen ? "Collapse all" : "Expand all"}</button>`}
      </div>
      <div class="insp-body">
        ${tile === undefined
          ? html`${this.renderRulesCard(page)}${this.renderNoTileCard(page)}
            <div class="ps-acts"><button class="pe-btn pe-danger" @click=${() => this.askDelete(id)}>${uiIcon("delete")}<span>Delete page…</span></button></div>`
          : this.renderTileCard(page, tile)}
      </div>`;
  }

  /**
   * The inspector with several tiles picked, the complication editor's
   * `multiEditor`: one card naming the picked tiles in reading order, each
   * with its face, name and kind, then Duplicate and Delete for all of them.
   * A tile's own settings are one tile at a time.
   */
  private renderPickedCard(page: WatchPage, ids: readonly string[], pages: readonly WatchPage[]): TemplateResult {
    const n = ids.length;
    const off = this.busy || this.editingOff(page);
    const copyable = this.copyableCount(page, ids);
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    const screen = this.screenOf(owner);
    const layout = watchPreviewLayout(page, screen, { flat: true });
    const states = this.previewStates();
    const rows = ids.flatMap((id) => {
      const tile = this.tileOn(page, id);
      if (tile === undefined) return [];
      const entityId = tileEntityId(tile);
      const kindLabel = tileKindLabel(tileKind(entityId));
      const label = watchPreviewTileLabel(tile, { states, pages, catalog: this.pickerCatalog }) || kindLabel;
      const placed = layout.tiles.find((t) => t.tile === tile) ?? layout.tiles.find((t) => sameWatchId(tileIdOf(t.tile), id));
      const color = watchKindColor(entityId, watchAddThemeOf(page)) ?? SECTION_COLOR.content;
      return [html`<div class="layer pe-picked-row" style=${`--k:${color}`} role="listitem" data-picked-tile=${id}>
        <span class="grip" aria-hidden="true"></span>
        ${this.renderTileThumb(page, tile, pages, screen, placed, layout.unit)}
        <span class="name"><b><span class="nm-t">${label}</span></b><small><span class="kind">${kindLabel}</span></small></span>
      </div>`];
    });
    const dupTitle = copyable === 0 ? "None of these tiles can be copied here."
      : copyable < n ? `${plural(copyable, "tile", "tiles")} of ${n} can be copied here; the rest cannot.` : `Duplicate ${n} tiles`;
    return html`<section class="sec pe-picked" data-open="true" data-help="on" style="--c: var(--wa-accent)">
      <div class="sec-h pinned">
        <span class="swatch">${uiIcon("layers")}</span>
        <span class="tt"><h4>${n} tiles picked</h4></span>
      </div>
      <div class="sec-b">
        <div class="layers pe-picked-list" role="list" aria-label="Picked tiles" style=${`--thumb-w: ${THUMB_W}px; --thumb-h: ${THUMB_H}px`}>${rows}</div>
        <div class="pe-picked-acts">
          <button class="pe-btn pe-picked-dup" ?disabled=${copyable === 0} title=${dupTitle} @click=${() => this.duplicateTile()}>
            ${uiIcon("duplicate")}<span>Duplicate ${n} tiles</span></button>
          <button class="pe-btn pe-danger pe-picked-del" ?disabled=${off} title=${this.saving ? SAVING_TEXT : "Delete or Backspace"} @click=${() => this.deleteTile()}>
            ${uiIcon("delete")}<span>Delete ${n} tiles</span></button>
        </div>
        <p class="hint">${IS_MAC ? "⌘" : "Ctrl"}-click a tile to add it or take it out, Shift-click to pick a run. Drag one to move them all together. Click one on its own to edit it alone.</p>
      </div>
    </section>
    ${this.renderPickedGroup(page, ids)}`;
  }

  /** The Group card under the picked tiles (`group-settings.ts`), on the
   * primary picked tile's host. */
  private renderPickedGroup(page: WatchPage, ids: readonly string[]): TemplateResult | typeof nothing {
    if (this.editingOff(page)) return nothing;
    const primary = this.selectedTileId === undefined ? undefined : this.tileOn(page, this.selectedTileId);
    const host = primary === undefined ? undefined : this.tileSettingsHost(page, primary);
    return host === undefined ? nothing : renderPickedGroupCard(host, ids, this.groupActions);
  }

  /** What the group rows ask of the editor: a new pick. */
  private groupActions: WatchGroupActions = {
    pick: (ids) => this.setPick(ids, this.selectedTileId),
  };

  /**
   * The selected tile's cards: its pinned Name, its place and size as the
   * Size card (handed to the tile settings so it folds and looks as the
   * others do), then the tile settings' own cards, and Delete tile under the
   * last.
   */
  private renderTileCard(page: WatchPage, tile: WatchPageTile): TemplateResult {
    const rect = watchTileRect(tile);
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
    // The presets first; the four boxes fold under them, opened by the
    // line that names where the tile is, and on their own while a typed
    // number was refused, so the note is never about boxes that are hidden.
    const fieldsOpen = this.sizeFieldsOpen || this.fieldNote !== undefined;
    const size = {
      summary: () => `${rect.colSpan}×${rect.rowSpan}`,
      body: () => html`
        <div class="pe-presets" role="group" aria-label="Size">
          ${WATCH_TILE_SIZE_PRESETS.map((p) => {
            const on = rect.colSpan === p.colSpan && rect.rowSpan === p.rowSpan;
            return html`<button class="pe-chip ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} ?disabled=${off}
              title=${`${p.colSpan} columns by ${p.rowSpan} rows`}
              @click=${() => this.sizeTile(p.colSpan, p.rowSpan)}>${p.name}</button>`;
          })}
        </div>
        <button type="button" class="pe-size-more" aria-expanded=${fieldsOpen ? "true" : "false"} aria-controls="pe-size-fields"
          title=${fieldsOpen ? "Hide the column, row, width and height boxes" : "Type the column, row, width and height"}
          @click=${() => { this.sizeFieldsOpen = !fieldsOpen; }}>
          <span class="pe-size-chev" aria-hidden="true">${fieldsOpen ? "▾" : "▸"}</span>
          <span>Column ${rect.col + 1}, row ${rect.row + 1} · ${rect.colSpan}×${rect.rowSpan}</span>
        </button>
        ${fieldsOpen ? html`<div class="pe-fields" id="pe-size-fields">
          ${field("Column", rect.col + 1, 1, 12 - rect.colSpan + 1, (v) => this.placeTile(v, rect.row + 1))}
          ${field("Row", rect.row + 1, 1, WATCH_EDITOR_MAX_ROWS - rect.rowSpan + 1, (v) => this.placeTile(rect.col + 1, v))}
          ${field("Width", rect.colSpan, 1, 12, (v) => this.sizeTile(v, rect.rowSpan))}
          ${field("Height", rect.rowSpan, 1, WATCH_EDITOR_MAX_ROWS - rect.row, (v) => this.sizeTile(rect.colSpan, v))}
        </div>` : nothing}
        ${this.fieldNote ? html`<p class="pe-warn" role="status">${this.fieldNote}</p>` : nothing}`,
    };
    const host = this.tileSettingsHost(page, tile);
    return html`
      ${host === undefined ? nothing : renderTileName(host)}
      ${host === undefined || off ? nothing : renderTileGroupLine(host, this.groupActions)}
      ${host === undefined ? nothing : renderTileSettings(host, { sections: tileInspectorSections(host), size })}
      <div class="ts-acts"><button class="pe-btn pe-danger" ?disabled=${off} title="Delete or Backspace" @click=${() => this.deleteTile()}>
        ${uiIcon("delete")}<span>Delete tile</span></button></div>`;
  }

  /** The tile settings' host for the selected tile, or undefined with no
   * host for the page or a tile with no id. */
  private tileSettingsHost(page: WatchPage, tile: WatchPageTile): TileSettingsHost | undefined {
    const host = this.editorHost(page);
    const tileId = tileIdOf(tile);
    if (host === undefined || tileId === "") return undefined;
    // Live as the host's own fields are: the tile as the page has it when
    // read, the one drawn once it is gone; looked up again only when the
    // page moved.
    let seen: { page: WatchPage; tile: WatchPageTile } | undefined;
    return extendHost(host, {
      tileId: () => tileId,
      tile: () => {
        const now = host.page;
        if (seen?.page !== now) seen = { page: now, tile: this.tileOn(now, tileId) ?? tile };
        return seen.tile;
      },
    });
  }

  /** The Add tile dialog, the delete question's pattern: a native modal
   * opened once when first drawn (`updated`), its state dropped on close. The
   * body is the add tile module's. */
  private renderAddTileDialog(): TemplateResult | typeof nothing {
    const page = this.currentPage();
    const host = this.editorHost(page);
    if (page === undefined || host === undefined) return nothing;
    const selectedTile = (): WatchPageTile | undefined => {
      const id = this.selectedTileId;
      return id === undefined ? undefined : this.tileOn(host.page, id);
    };
    const close = () => this.closeAsk();
    const addHost: AddTileHost = extendHost(host, {
      tileId: () => (selectedTile() === undefined ? undefined : this.selectedTileId),
      tile: selectedTile,
      close: () => close,
    });
    return html`<dialog class="pe-ask pe-add-dialog" aria-labelledby="pe-add-title"
      @close=${() => { this.addTileOpen = false; }}>
      <div class="pe-ask-head">
        <h3 id="pe-add-title">Add a tile to "${watchPageName(page)}"</h3>
        <button type="button" class="pe-icon-btn" title="Close" aria-label="Close" @click=${() => this.closeAsk()}>${uiIcon("close")}</button>
      </div>
      ${renderAddTile(addHost)}
    </dialog>`;
  }

  /** On a smart page, its Rules cards (`smart-settings.ts`): the Rules card,
   * the selected rule's Header and its style. */
  private renderRulesCard(page: WatchPage): TemplateResult | typeof nothing {
    if (!isSmartWatchPage(page)) return nothing;
    const host = this.editorHost(page);
    return host === undefined ? nothing : renderSmartRulesCard(host);
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
      <p>It is saved again as a new revision${record ? `, after revision ${record.revision}` : ""}. The copy shown now stays in the earlier saves. The watch picks it up the next time it checks.</p>
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
        <p>${ask.roomsKind === "rooms" ? "This home's rooms name" : "The watch settings name"} this page for room quick jump:</p>
        <ul class="pe-ask-list">
          ${links.roomFallback ? html`<li>The page it opens when no room matches</li>` : nothing}
          ${links.roomMappingKeys.map((key) => html`<li>The page for <b>${key}</b></li>`)}
        </ul>
        <p class="pe-muted">After the delete the ${this.onPhone ? "iPhone" : "watch"} opens another page there instead. The setting itself stays as it is.</p>` : nothing}
      ${this.renderDeleteRefs(ask)}
      <div class="pe-ask-foot">
        <button class="pe-btn" @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary pe-danger" @click=${() => this.deletePage()}>Delete page</button>
      </div>
    </dialog>`;
  }

  /** The delete question's menu slots and complication taps that open the
   * page (`page-refs.ts`), which the save that deletes the page clears. */
  private renderDeleteRefs(ask: DeleteAsk): TemplateResult {
    if (ask.refsState === "loading") return html`<p class="pe-muted">Checking the menus and complications…</p>`;
    const slots = menuSlotsOpeningPage(ask.menus, ask.pageId);
    const complications = complicationsOpeningPage(ask.complications ?? [], ask.pageId);
    const unread = ask.menus === undefined && ask.complications === undefined;
    if (slots.length === 0 && complications.length === 0) {
      return unread
        ? html`<p class="pe-muted">The menus and complications could not be read, so this does not say whether they open this page.</p>`
        : html``;
    }
    const tapWords = (c: { whole: boolean; layers: number }) => [
      c.whole ? "its tap" : undefined,
      c.layers > 0 ? plural(c.layers, "tap layer", "tap layers") : undefined,
    ].filter((w): w is string => w !== undefined).join(" and ");
    return html`
      <p>These open this page too:</p>
      <ul class="pe-ask-list pe-del-refs">
        ${slots.map((slot) => html`<li><b>${slot.where}</b>: the Go to Page slot${slot.position === "" ? "" : ` (${slot.position})`}</li>`)}
        ${complications.map((c) => html`<li><b>Complication "${c.name}"</b>: ${tapWords(c)}</li>`)}
      </ul>
      <p class="pe-muted">When you save the delete, the menu slots are removed and those taps do nothing.</p>`;
  }

  /** The save question: the Speak and Assist tiles on the pages changed
   * since `base` that have no speakers, in the phone's words. An edit that
   * fixes every tile while it is open leaves nothing to ask: the dialog then
   * says so and still saves. */
  private renderSaveAsk(document: WatchPagesDocument, base: WatchPagesDocument): TemplateResult {
    const warning = watchSaveSpeakerWarning(document, this.voiceDefaults, base);
    const pages = watchPagesOf(document);
    const states = this.hass?.states;
    const speaker = (id: string) => {
      const name = states?.[id]?.attributes?.friendly_name;
      return typeof name === "string" && name.trim() !== "" ? name : watchObjectName(id);
    };
    return html`<dialog class="pe-ask" aria-labelledby="pe-save-title"
      @close=${() => { this.saveAsk = false; }}>
      <h3 id="pe-save-title">${warning?.title ?? "Save"}</h3>
      ${warning === undefined
        ? html`<p>Every Speak and Assist tile has its speakers now.</p>`
        : html`${warning.messages.map((m) => html`<p>${m}</p>`)}
          <ul class="pe-ask-list">${warning.tiles.map((t) => {
            const label = tileLabel(t.tile, states, pages);
            return html`<li><b>${watchPageName(t.page)}</b>: ${tileKindLabel(tileKind(tileEntityId(t.tile)))}${label !== "" ? ` "${label}"` : ""}</li>`;
          })}</ul>
          ${warning.fallback.length > 0
            ? html`<p class="pe-muted">Until then Choose Speakers tiles use the default speakers: ${warning.fallback.map(speaker).join(", ")}.</p>`
            : nothing}
          ${warning.chooseOnWatch !== undefined ? html`<p class="pe-muted">${warning.chooseOnWatch}</p>` : nothing}`}
      <div class="pe-ask-foot">
        <button class="pe-btn" @click=${() => this.closeAsk()}>${warning?.cancel ?? "Cancel"}</button>
        <button class="pe-btn pe-primary" @click=${() => void this.save(true)}>${warning?.saveAnyway ?? "Save"}</button>
      </div>
    </dialog>`;
  }

  // The panel's form rules first, so the field rows of `editors.ts` look as
  // they do in the panel; then the complication editor's chrome
  // (`editor-chrome.ts`: the top bar, the columns, the left cards and their
  // rows, the canvas card, the inspector); this element's own rules come
  // after and win the ties. The two modules' rules come last, so a module can
  // size its own parts of this element (its dialog, say) without outranking
  // anything.
  static override styles = [formStyles, chromeTokens, topBarStyles, columnStyles, leftCardStyles, rowListStyles, canvasStyles, inspectorStyles, watchPagePreviewStyles, watchFrameStyles, css`
    /* A column, so the foot bar (config-foot.ts) can take the space left
       at the foot of a short editor; --cf-pad is the padding it reaches
       through to sit edge to edge. */
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      /* A tile or field brought into view lands under the sticky top. */
      scroll-padding-top: var(--pe-top-h, 0px);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, p { margin: 0; }

    /* The top bar, and a note under it while there is one, stay at the top
       of the editor: one block, sticky to the host's top edge and edge to
       edge as the foot bar is at the bottom, on the host's own background so
       the editor scrolls under it. Above the cards and their menus; the
       dialogs are modal, in the top layer, above it. Its measured height is
       --pe-top-h on the host (measureTop). */
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h2 { font-size: 20px; font-weight: 650; }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    /* The browser's own monospace, not the shared sheet's family. */
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }

    /* The bar's buttons with a glyph and words (the way back, Menus, the
       panel's Watch settings) on one line, as the panel's own bar draws them. */
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .tb-saved .cf-saved { margin: 0; font-size: inherit; color: inherit; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
    .pe-top > .pe-note { margin: 10px var(--cf-pad, 16px) 0; }

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

    /* The complication editor's three columns (editor-chrome.ts), with one
       difference: there the editor is one viewport tall and each column
       scrolls inside it; here the editor scrolls as a whole, the stage with
       it, so a long page can be dragged down its length. The side widths come
       in as custom properties already fitted to the measured host width
       (fitColumnWidths). */
    .layout.pe-layout {
      flex: none; min-height: auto; overflow: visible; align-items: start; padding: 0;
      /* The room above the foot bar. */
      margin-bottom: 14px;
    }
    /* The Pages and Tiles cards and the inspector stay in view while the
       stage scrolls the editor: each sticks just under the sticky top block
       (the host's scroll box, inside its padding, starts --cf-pad down; the
       block reaches --pe-top-h down from the edge) and, when taller than the
       room left, scrolls on its own. --pe-view-h is the host's measured
       content height, less what the top block covers past the padding, what
       the foot bar covers (36px, less the padding it sits in) and a little
       air. */
    .pe-layout > .column.left, .pe-layout > .column.inspector {
      --pe-under-top: max(0px, calc(var(--pe-top-h, 0px) - var(--cf-pad, 16px)));
      position: sticky; top: var(--pe-under-top);
      max-height: calc(var(--pe-view-h, calc(100dvh - 120px)) - 30px - var(--pe-under-top));
      overflow-y: auto; overflow-x: hidden;
    }
    .pe-layout > .column.left { scrollbar-gutter: auto; }
    .pe-layout > .column.left > .card { flex: none; }
    .pe-layout > .column.canvas { overflow: visible; min-height: auto; }
    /* One column under 820px, the complication editor's order: the page and
       its tiles, the settings, then the lists. Nothing sticks there: a sticky
       inspector slid over the Tiles card under it and took its clicks. The
       selectors are as strong as the sticky rule's, so they win; .cols-1 is
       the same width as the element measures it. */
    @container (max-width: 820px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      .pe-layout > .column.left, .pe-layout > .column.canvas, .pe-layout > .column.inspector {
        grid-column: auto; position: static; max-height: none; overflow: visible;
      }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }
    .layout.pe-layout.cols-1 { grid-template-columns: minmax(0, 1fr); }
    .layout.pe-layout.cols-1 > .gutter { display: none; }
    .layout.pe-layout.cols-1 > .column.left, .layout.pe-layout.cols-1 > .column.canvas, .layout.pe-layout.cols-1 > .column.inspector {
      grid-column: auto; position: static; max-height: none; overflow: visible;
    }

    /* The Pages and Tiles cards: the complication editor's Pages and Layers
       cards, their rows its layer rows. */
    .pe-pages-card > .layers, .pe-tiles-card > .layers { padding: 6px 8px 8px; overflow: visible; }
    .pe-pages-card > .lc-note, .pe-tiles-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
    .pe-pages-card > .lc-note.warn { color: var(--wa-amber); }
    /* A page row keeps a grip in sight: a finger drags a page by it, and a
       mouse drags the whole row. */
    .pe-page-row { grid-template-columns: 14px var(--thumb-w) minmax(0, 1fr) auto; }
    .pe-page-row .grip {
      visibility: visible; width: 14px; display: flex; align-items: center; justify-content: center; align-self: stretch;
      color: var(--wa-muted); cursor: grab; touch-action: none; opacity: .5;
    }
    .pe-page-row:hover .grip, .pe-page-row.hl .grip { opacity: 1; }
    .pe-page-row .grip svg.ui-icon { width: 12px; height: 12px; }
    .pe-page-row.pe-dragging { opacity: .5; }
    .pe-pages-card.saving .pe-page-row, .pe-pages-card.saving .pe-page-row .grip { cursor: progress; }
    /* The row with its menu open keeps its buttons, not its badges, after
       the pointer leaves it. */
    .layer.menu-open .acts { display: inline-flex; }
    .layer.menu-open .badges { display: none; }
    .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
    .layer .acts button.icon.off { color: var(--wa-amber); }
    .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
    .badge.pe-smart { color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 14%, transparent); }
    /* The thumbs: a page's top, or a tile's face, drawn small. */
    .layer .thumb.pe-thumb { position: relative; }
    .pe-thumb-tile { position: absolute; overflow: hidden; pointer-events: none; }
    .layer .thumb.pe-thumb-smart { display: grid; place-items: center; color: rgba(255, 255, 255, .7); }
    .pe-thumb-smart svg.ui-icon { width: 12px; height: 12px; }
    .pe-rename {
      width: 100%; min-width: 0; margin: 0; padding: 2px 6px; border: 1px solid var(--wa-sel-ring); border-radius: 6px;
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
    /* A page row's ··· menu, the panel's pop menu, hung under the row's
       right end. */
    .layer > .pop-menu.pe-menu { top: calc(100% - 4px); right: 6px; z-index: 30; min-width: 150px; cursor: default; }
    .pe-menu .row:disabled { opacity: .5; cursor: default; }
    .pe-menu .row:disabled:hover { background: transparent; }
    .pe-menu .row.pe-danger { color: var(--wa-need); }
    .pe-drop-line {
      position: absolute; left: 0; right: 0; height: 3px; margin-top: -1px; border-radius: 2px;
      background: var(--wa-accent); pointer-events: none;
    }

    .pe-badge {
      display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
      color: var(--wa-muted); background: var(--wa-field); white-space: nowrap;
    }
    .pe-badge.smart { color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 14%, transparent); }

    /* The canvas card: the complication editor's head, dotted stage, tool
       strip and values bar. Its stage is not the fitted box of a face but
       the watch at a set scale, as tall as the page: the stage grows with
       it and the editor scrolls. */
    .column.canvas > .card.canvas-card.pe-canvas { min-height: 0; flex: none; }
    /* While a page strip popover is open it hangs out of the card over the
       stage, and past the card's foot or side on a short page or a narrow
       column: the card stops clipping and stacks over the sticky columns
       beside it, still under the sticky top block (z-index 7). */
    .column.canvas > .card.canvas-card.pe-canvas.pe-pop-open { overflow: visible; position: relative; z-index: 6; }
    .card.canvas-card.pe-no-page { min-height: 0; padding: 24px; }

    /* The page strip under the canvas head: a chip per page setting, each
       opening its popover. The chips wrap onto a second line rather than
       squeeze. */
    .pe-pstrip {
      display: flex; flex-wrap: wrap; align-items: center; gap: 6px; flex: none; min-width: 0;
      padding: 8px 12px; border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .pe-pstrip-item { position: relative; min-width: 0; }
    /* "Page" leads the strip (short, so the switches fit on one line); a hairline stands between each option. */
    .pe-pstrip-label { flex: none; font-size: 11.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--wa-muted); margin-right: 4px; }
    .pe-pstrip-sep { flex: none; width: 1px; height: 18px; margin: 0 2px; background: var(--wa-line); }
    .pe-pstrip-tog { display: inline-flex; align-items: center; min-width: 0; padding: 0 4px; }
    .pe-pstrip-tog.pe-switch, .pe-pstrip-tog .pe-switch { font-size: 12px; white-space: nowrap; }
    /* An instant hint under a strip switch, from its data-tip, shown the
       moment the pointer is on it or it holds focus. */
    .pe-tip { position: relative; }
    .pe-tip::after {
      content: attr(data-tip); position: absolute; top: calc(100% + 6px); left: 0; z-index: 30;
      width: max-content; max-width: 280px; white-space: normal; padding: 6px 9px; border-radius: 7px;
      font-size: 11.5px; font-weight: 400; line-height: 1.35; color: var(--wa-ink); background: var(--wa-card);
      border: 1px solid var(--wa-line-strong); box-shadow: var(--wa-shadow-pop);
      opacity: 0; visibility: hidden; pointer-events: none; transition: opacity .08s ease-out;
    }
    /* Under the pointer, or reached by keyboard. Not after a click: the
       switch keeps focus then, and the hint stayed up until a click away. */
    .pe-tip:hover::after, .pe-tip:has(:focus-visible)::after { opacity: 1; visibility: visible; }
    button.pe-pchip {
      display: inline-flex; align-items: center; gap: 6px; height: 28px; max-width: 100%; padding: 0 8px 0 4px;
      border: 0; border-radius: 999px; background: var(--wa-panel); box-shadow: inset 0 0 0 1px var(--wa-line);
      color: var(--wa-ink); font: inherit; font-size: 12px; white-space: nowrap; cursor: pointer;
    }
    button.pe-pchip:hover { box-shadow: inset 0 0 0 1px var(--wa-line-strong); }
    button.pe-pchip[aria-expanded="true"] {
      background: color-mix(in srgb, var(--wa-accent) 12%, var(--wa-panel));
      box-shadow: inset 0 0 0 1.5px var(--wa-accent);
    }
    button.pe-pchip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-pchip-sw {
      display: grid; place-items: center; flex: none; width: 18px; height: 18px; border-radius: 50%;
      background: color-mix(in srgb, var(--k) 26%, transparent); color: var(--k);
    }
    .pe-pchip-sw svg.ui-icon { width: 11px; height: 11px; }
    /* The theme's own dot, the popover's .ps-theme drawn small. */
    .pe-pchip-sw.pe-pchip-theme {
      background: radial-gradient(circle at 50% 50%, var(--ps-g) 0 34%, transparent 35%), linear-gradient(135deg, var(--ps-a), var(--ps-b));
      box-shadow: inset 0 0 0 1px rgba(128, 128, 128, .45);
    }
    .pe-pchip-l { font-weight: 600; }
    .pe-pchip-v { min-width: 0; overflow: hidden; text-overflow: ellipsis; color: var(--wa-muted); }
    .pe-pchip-dot { display: block; flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--k); }
    .pe-pchip-chev { flex: none; font-size: 10px; color: var(--wa-muted); }
    /* The popover: the panel's pop menu, hung under its chip from the chip's
       left edge, as wide as a settings column, scrolling inside itself when
       taller than the room. Above the stage's tool strip (z-index 5). */
    .pop-menu.pe-ppop {
      left: 0; right: auto; z-index: 20; display: block; padding: 0; gap: 0;
      width: min(400px, calc(100vw - 32px)); max-height: min(70vh, 560px); overflow: auto; overscroll-behavior: contain;
      font-size: 13px; cursor: default;
    }
    .pe-ppop-h {
      position: sticky; top: 0; z-index: 1; display: flex; align-items: center; gap: 6px;
      padding: 9px 12px 7px; border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
      font-size: 12.5px; font-weight: 700;
    }
    .pe-ppop-b { padding: 8px 12px 10px; }
    /* The watch picker in the top bar, the complication editor's Browse
       button, and its menu: each watch's glyph in its person's color, its
       name, and a check on the open one. */
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.pe-watch-open .pe-chip-glyph svg.ui-icon { width: 14px; height: 14px; opacity: 1; }
    .picker > button.pe-watch-open .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pop-menu.pe-watch-menu { min-width: 220px; }
    .pe-watch-menu .row.pe-watch-row { display: flex; align-items: center; gap: 8px; }
    .pe-watch-row .pe-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .pe-watch-row[aria-checked="true"] { background: color-mix(in srgb, var(--wa-accent) 14%, transparent); }
    .pe-watch-check { display: inline-flex; color: var(--wa-accent); }
    .pe-watch-check svg.ui-icon { width: 14px; height: 14px; }
    /* The open watch in the canvas head: plain words, as the shape's. */
    .cv-shape.pe-watch-crumb { color: var(--wa-ink); font-weight: 500; }
    .pe-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .pe-stage-area { padding-top: 92px; }
    }
    /* The picture keeps its size and the stage scrolls sideways under it on
       a screen narrower than the watch drawn at this scale. */
    .pe-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .pe-stage-area > .under {
      flex-direction: column; gap: 4px; align-self: center; max-width: 460px;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
    /* The watch's size and color are facts, not a menu. */
    .stage-tools button.tb.pe-case { cursor: default; }
    .stage-tools button.tb.pe-case:hover { background: transparent; }
    .stage-tools button.tb.pe-case > svg.ui-icon { width: 14px; height: 14px; }
    /* The tool strip lets the Live preview switch's hint hang below it, over
       the stage and its tiles. */
    .pe-stage-area > .stage-tools { overflow: visible; z-index: 8; }
    /* The Live preview switch, sized as the strip's button words. */
    .stage-tools .pe-switch.pe-live { gap: 7px; height: 26px; padding: 0 8px; font-size: 11.5px; font-weight: 500; white-space: nowrap; }
    .vchip.vpill .val {
      flex: none; max-width: 50%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-weight: 700; font-variant-numeric: tabular-nums; color: var(--wa-ink);
    }
    .vchip.vpill b { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .vpill .vp-icon > svg { width: 13px; height: 13px; }
    /* The test state's control at the end of the Live strip's chip, as the
       complication editor's values row lays it out (editor-chrome sizes it). */
    .vchip.vpill .test-ctl { display: flex; align-items: center; min-width: 0; }
    .vchip.vpill .test-ctl input[type=range] { margin: 0; accent-color: var(--wa-testing); cursor: pointer; }
    .vchip.vpill button.val { background: none; border: 0; padding: 0; cursor: text; }
    /* A state with a known set of words: the name, then every state as a
       chip in a row that wraps, the pill growing to hold it. */
    .vchip.vpill.pe-states { height: auto; min-height: 30px; padding-top: 4px; padding-bottom: 4px; }
    .vchip.vpill.pe-states b { flex: 0 1 auto; max-width: 180px; }
    .pe-state-chips { display: flex; flex: 1 1 auto; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    button.pe-state-chip {
      display: inline-flex; align-items: center; gap: 5px; height: 24px; padding: 0 9px; border: 1px solid var(--wa-line-strong); border-radius: 999px;
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 11.5px; white-space: nowrap; cursor: pointer;
    }
    button.pe-state-chip:hover { background: var(--wa-panel); }
    button.pe-state-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.pe-state-chip.on {
      background: color-mix(in srgb, var(--wa-testing) 18%, transparent); border-color: var(--wa-testing); color: var(--wa-testing); font-weight: 600;
    }
    /* Home Assistant's state now. */
    .pe-state-live { display: block; flex: none; width: 5px; height: 5px; border-radius: 50%; background: var(--wa-live, #2f9e6a); }
    .pe-screen { overflow: visible; user-select: none; -webkit-user-select: none; }
    .pe-screen.saving .pe-tile, .pe-screen.saving .pe-handle { cursor: progress; }
    .pe-screen:focus { outline: none; }
    /* The cells stay inside the screen's round bottom corners, and show only
       while a tile is moved or resized. */
    .pe-cells {
      position: absolute; left: 0; pointer-events: none; clip-path: inset(0 round 0 0 var(--wf-radius, 28px) var(--wf-radius, 28px));
      opacity: 0; transition: opacity .12s;
    }
    .pe-screen.moving .pe-cells { opacity: 1; }
    .pe-cells > path { fill: rgba(255, 255, 255, 0.07); }
    /* The marks drawn on the watch's screen (selection, handles, swap) are a
       light form of the accent: the screen is black in both skins, where the
       light skin's own accent is too dark to see. */
    .pe-screen { --pe-mark: color-mix(in srgb, var(--wa-accent) 55%, #fff); --pe-edge: rgba(255, 255, 255, 0.16); }
    /* A tile has no ground of its own: the screen draws the page's
       background (color, brightness, pattern) under it, as the watch does,
       and the face draws the tile, with no edge of the editor's own, so an
       unlit tile reads as faintly as it does on the watch. */
    .pe-tile {
      position: absolute; display: block; margin: 0; padding: 0; border: 0; border-radius: 6px;
      background: transparent;
      color: inherit; font: inherit; text-align: left; cursor: grab;
      touch-action: manipulation;
    }
    .pe-tile.fixed { pointer-events: none; }
    .pe-tile:focus-visible { outline: none; box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--pe-mark); }
    .pe-tile.sel { touch-action: none; box-shadow: 0 0 0 2px var(--pe-mark); z-index: 2; }
    .pe-tile.sel:focus-visible { box-shadow: 0 0 0 2px var(--pe-mark), 0 0 0 4px #000, 0 0 0 6px var(--pe-mark); }
    /* A Tiles row in a pick of several: lit exactly like the selected row,
       the complication editor's .layer.multi, so every picked row reads as
       selected. */
    .pe-tile-row.multi {
      background: color-mix(in srgb, var(--wa-accent) 30%, var(--wa-card));
      box-shadow: inset 0 0 0 2px var(--wa-accent);
    }
    /* The inspector's card for a pick of several: the picked tiles as rows
       (no buttons of their own), then Duplicate and Delete for all. */
    .pe-picked-list { display: flex; flex-direction: column; gap: 2px; margin-bottom: 10px; }
    .pe-picked-list > .layer { cursor: default; }
    .pe-picked-acts { display: flex; flex-wrap: wrap; gap: 6px; }
    /* A tile group: its card under the picked tiles, and the line under a
       grouped tile's name (group-settings.ts). */
    .pe-group .ts-body { border: 0; margin: 0 0 8px; padding: 0; min-width: 0; }
    .pe-group-line { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin: 0 0 8px; padding: 6px 10px; border-radius: 8px; background: var(--wa-panel); font-size: 12px; color: var(--wa-muted); }
    .pe-group-words { display: inline-flex; align-items: center; gap: 6px; margin-right: auto; }
    .pe-group-words .ui-icon { width: 14px; height: 14px; }
    /* The tile whose Tiles row is pointed at: a solid tint and a thin ring,
       the complication editor's hover on a layer, so it never reads as the
       selection's ring when the pointer rests on the selected tile's row. */
    .pe-tile.hov::after {
      content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
      background: color-mix(in srgb, var(--pe-mark) 22%, transparent);
      box-shadow: inset 0 0 0 1px var(--pe-mark);
    }
    .pe-tile.moving { z-index: 4; opacity: .9; cursor: grabbing; box-shadow: 0 8px 22px rgba(0, 0, 0, .6), 0 0 0 2px var(--pe-mark); }
    .pe-tile.partner { opacity: .6; box-shadow: 0 0 0 2px var(--pe-mark); }
    .pe-ghost { position: absolute; z-index: 3; border-radius: 6px; pointer-events: none; border: 2px dashed; }
    .pe-ghost.ok { border-color: #34c759; background: rgba(52, 199, 89, .16); }
    .pe-ghost.swap { border-color: var(--pe-mark); background: color-mix(in srgb, var(--pe-mark) 20%, transparent); }
    .pe-ghost.swap-to { border-color: var(--pe-mark); border-style: dotted; background: color-mix(in srgb, var(--pe-mark) 10%, transparent); }
    .pe-ghost.no { border-color: #ff6b6b; background: rgba(255, 107, 107, .16); }
    .pe-sel { position: absolute; z-index: 3; border-radius: 6px; pointer-events: none; }
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
    /* The line under the presets that opens the four boxes: where the tile
       is, with a disclosure arrow, as a row of text rather than a button. */
    .pe-size-more {
      display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin-top: 6px; padding: 2px 4px 2px 0;
      border: 0; border-radius: 6px; background: transparent; color: var(--wa-muted); font: inherit; font-size: 12px; cursor: pointer;
    }
    .pe-size-more:hover { color: var(--wa-ink); }
    .pe-size-more:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-size-more[aria-expanded="true"] { color: var(--wa-ink); }
    .pe-size-chev { width: 10px; font-size: 10px; text-align: center; }
    .pe-chip {
      min-height: 28px; padding: 0 10px; border: 1px solid var(--wa-line-strong); border-radius: 999px;
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 12px; cursor: pointer;
    }
    .pe-chip:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-chip.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
    .pe-chip:disabled { opacity: .55; cursor: default; }

    /* The earlier saves, in the foot bar's History dialog. */
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
    /* An iPhone with no pages: its two ways to start, side by side. */
    .pe-empty-actions { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 4px; }
    /* Copy from watch: the watches, then what to copy, a list that scrolls
       on its own when a watch has many pages. */
    .pe-copy-from { display: flex; flex-wrap: wrap; gap: 6px 16px; }
    .pe-copy-list {
      display: flex; flex-direction: column; gap: 2px; max-height: min(320px, 45vh); overflow-y: auto;
      padding: 4px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px);
    }
    .pe-check.pe-copy-opt { align-items: flex-start; padding: 6px; border-radius: 6px; }
    .pe-check.pe-copy-opt:hover { background: var(--wa-panel); }
    .pe-check.pe-copy-opt > input { margin-top: 2px; }
    .pe-copy-l { display: flex; flex-direction: column; gap: 2px; min-width: 0; overflow-wrap: anywhere; }
    .pe-copy-l > b { font-weight: 600; }
    .pe-copy-l > .pe-muted { font-size: 12px; }
    /* The Add tile dialog (dialog.pe-add-dialog): its title and a close
       button, then the module's body. */
    .pe-ask-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
    .pe-ask-head > .pe-icon-btn { margin: -4px -6px 0 0; }

    :host([narrow]) { --cf-pad: 12px; }
    @container (max-width: 820px) {
      .pe-hint { display: none; }
    }
  `, tileSettingsStyles, specialSettingsStyles, appSettingsStyles, pageSettingsStyles, addTileStyles, smartSettingsStyles, configFootStyles];
}

if (!customElements.get("wa-page-editor")) {
  customElements.define("wa-page-editor", WaPageEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-page-editor": WaPageEditor;
  }
}
