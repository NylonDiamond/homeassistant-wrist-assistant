// `<wa-menu-editor>`: the watch's menus as Home Assistant keeps them (the
// `menus` watch config kind), and an editor for them: the Anywhere menu and
// its style, the Entity quick menu with each entity's own menu, and the page
// switcher's style.
//
// It wears the complication editor's chrome (`editor-chrome.ts`) the way the
// page editor does: the top bar, then three columns with drag gutters (the
// Menus and Slots cards, the canvas with the shown menu on the watch, and the
// inspector), and the foot bar. One menu at a time is in the canvas, picked
// in the Menus card, as the complication editor shows one page. The views
// are `menu-view.ts`.
//
// The host pattern of the page editor (`watch-pages/page-editor.ts`): watch
// chips from the owners list, the record read with `watch_config/get` and kept
// as raw JSON in a draft (`draft.ts`) with undo and redo, a save through
// `watch_config/save` that merges when another save landed too, the earlier
// saves with restore, the delivery check, and the size budget. The `catalog` and
// `behavior` records are read beside it, read only, for the pickers' names;
// the live line reads them again when they change and merges a `menus`
// change into the open draft. The home's HTTP action library
// (`watch-pages/http-library.ts`) is read when a watch opens and on a
// reconnect; it has no live line.
//
// The `pages` record is read beside it too, into the page draft the page
// editor keeps for the watch (`watch-pages/kept.ts`): a page's own settings
// for the page switcher (hidden, name or icon, its name, icon and color) are
// edited here, as on the iPhone, through that second draft. So an unsaved
// edit made on either screen is on the other, Save saves both, Discard
// discards both, and Undo works on the pages while a page is picked in the
// switcher's Pages card.
//
// A watch with no menus record yet opens ready on the app's defaults
// (`menu-defaults.json`), unsaved, under the new watch line (`new-watch.ts`);
// its first Save is a save over revision 0, which Home Assistant takes for a
// paired watch. While its iPhone may still move the menus here it waits,
// and "Start fresh instead" opens the same ready screen.
//
// Each of the device's two menus is a menu of the home's library
// (`library/`): the foot of its row in the Menus card names it and makes a
// copy for this device ("Make a copy for this watch"), and the strip under
// the canvas head says which devices use it (a round tick each, which moves
// that device to this menu). Home
// Assistant maps a save back onto the library menu, so an edit here reaches
// every device that uses it.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/menus` (`hook.ts`). Nothing it imports may import `icons.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 1 build
// contract", items 5 to 7), and docs/one_library_plan_2026-10.md, step 3.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
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
import { SCRUB_END, SCRUB_START } from "../editors.js";
import { formStyles } from "../form-styles.js";
import { HeadBar, headBarStyles, renderHeadStatus } from "../head-bar.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchConfigHistoryEntry,
  type WatchConfigLinkFailure,
  type WatchConfigRecord,
  fetchOwners,
  fetchHttpActions,
  fetchWatchConfig,
  fetchWatchConfigHistory,
  fetchWatchConfigHistoryEntry,
  restoreWatchConfig,
  saveWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import { live } from "lit/directives/live.js";
import { type LinkDevice, joinWords, linkDevicesOf } from "../watch-pages/devices.js";
import { type MenuUnit, libraryErrorText } from "../library/client.js";
import {
  type LibraryItemRef,
  fetchLibraryRecord,
  libraryDraftKey,
  libraryItemIO,
  libraryModeStyles,
  type PreviewKind,
  previewOwner,
  storedPreviewKind,
  renderBarDevices,
  renderLibraryTag,
  renderPreviewPicker,
  sameLibraryItem,
  summaryRevision,
} from "../library/item-mode.js";
import { type LibraryMenu, MENU_UNIT_TITLES, libraryMenu, menuFor, sameId } from "../library/model.js";
import { LibraryController } from "../library/store.js";
import { libraryTicksStyles, renderTicks } from "../library/ticks.js";
import { copiedMenuText, copyBlockedText, copyMenuName, dirtyElsewhereText, menuRestoreLines, ownerWords } from "../watch-pages/library-editing.js";
import { isPhoneId } from "../phone-pages.js";
import { deviceColor, deviceColors } from "../device-colors.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { agoWords } from "../send-state.js";
import { SymbolBrowser } from "../symbols.js";
import { uiIcon } from "../ui-icons.js";
import {
  type WatchCatalog,
  type WatchCatalogStatusPage,
  watchCatalogEventIsNews,
  watchCatalogFromRecord,
  watchCatalogReadMeansNone,
  watchStatusPagesFromRecord,
} from "../watch-pages/catalog.js";
import { type WatchHttpLibrary, readWatchHttpLibrary, watchCatalogWithHttpLibrary, watchHttpLibraryReadMeansNone } from "../watch-pages/http-library.js";
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
} from "../watch-pages/config-foot.js";
import { type WatchPagesDraft, saveWatchPagesDraft } from "../watch-pages/draft.js";
import { findWatchPage } from "../watch-pages/edit.js";
import { NO_ICONS, memoIconNames, watchKeysTypeText } from "../watch-pages/editor-host.js";
import { anyWatchPagesDirty, dropAllWatchPages, keptWatchPagesDraft, takeWatchPagesRecord } from "../watch-pages/kept.js";
import { watchFrameStyles } from "../watch-frame.js";
import {
  PHONE_SIZE_TEXT,
  PHONE_STAGE_ZOOM,
  type PhonePagesLayout,
  phoneFrameStyles,
  phoneModelForScreenSize,
  phonePagesLayout,
  phonePagesScreen,
} from "../phone-frame.js";
import {
  type WatchPagesDocument,
  isHiddenWatchPage,
  isJsonObject,
  isSmartWatchPage,
  isSystemWatchPage,
  watchPageId,
  watchPageName,
  watchPageTiles,
  watchPagesOf,
} from "../watch-pages/model.js";
import { type WatchPagesNote, linkFailuresOf, watchCommandError, watchPagesSaveNote, withLinkFailures } from "../watch-pages/save-note.js";
import { resolveSmartPagesBeforeSave } from "../watch-pages/smart-model.js";
import { friendlyError } from "../friendly-error.js";
import { restoredText } from "../revision-words.js";
import { stageFitZoom, stageZoomIn, stageZoomLabel, stageZoomOut } from "../watch-pages/stage.js";
import type { SwitcherSettingsHost } from "../watch-pages/switcher-settings.js";
import { scrubWatchOrphanTriggers } from "../watch-pages/tile-settings-model.js";
import {
  START_FRESH_BUTTON,
  type NoRecordStart,
  type SettingDevice,
  WAIT_FOR_IPHONE_TEXT,
  deliveryState,
  deviceNoun,
  followWatch,
  mayStart,
  noRecordStart,
  noRecordTitle,
  savedByLine,
  watchAppDevices,
  watchName,
} from "../watch-settings.js";
import {
  type WatchMenusDraft,
  anyWatchMenusDirty,
  dropAllWatchMenus,
  forgetWatchMenusDraft,
  keptWatchMenusDraft,
  newWatchMenusDraft,
  saveWatchMenusDraft,
  takeWatchMenuAsk,
  takeWatchMenusRecord,
} from "./draft.js";
import { navigatePagesFromMenus, navigateWatchMenus, registerWatchMenusDrafts } from "./hook.js";
import {
  type MenuSwitcherPage,
  type MenuSwitcherRow,
  type MenusScreen,
  type MenusSection,
  type MenusViewHost,
  deselectMenuSlot,
  loadMenusZoom,
  menuSectionLabel,
  menuStageFacts,
  menuStageHint,
  librarySections,
  menuViewStyles,
  renderMenuInspector,
  renderMenusCard,
  renderSlotsCard,
  saveMenusZoom,
  selectedSwitcherPage,
  showMenuSettings,
  shownMenu,
} from "./menu-view.js";
import {
  type MenuTargets,
  type MenusDocument,
  WATCH_MENUS_UPDATE_TEXT,
  asWatchMenusDocument,
  isMenuUUID,
  scrubWatchMenuOrphanTriggers,
  watchMenuOverrideIds,
  watchMenuSlots,
  watchMenusBudget,
  watchMenusReadMeansUnsupported,
} from "./model.js";
import {
  chooseStartFresh,
  firstSaveNote,
  newWatchStyles,
  opensReady,
  renderNewWatchBanner,
  renderSaveReason,
  saveBlockedText,
} from "./new-watch.js";
import { howToStyles } from "../screen-howto.js";
import { menuStageStyles, renderMenuHowTo, renderMenuStage, renderMenuStageFoot, renderMenuStageTools } from "./menu-stage.js";
import { watchMenusReplacedText, watchMenusSaveNote } from "./save-note.js";
import type { MenuVoiceContext } from "./slot-voice.js";
import { menuInspectorLookStyles } from "./menu-inspector-look.js";
import { voiceDocumentOfRecord, voicePhraseTargets, watchVoiceFallbacks } from "../watch-voice/defaults.js";

/** Whether this editor holds unsaved edits: to the menus, or to the pages
 * (a page's switcher settings are edited here, in the page draft the page
 * editor keeps too). The page editor's own chunk may never have loaded, so
 * the pages count here as well. */
function anyMenusEditorDirty(): boolean {
  return anyWatchMenusDirty() || anyWatchPagesDirty();
}

registerWatchMenusDrafts({
  dirty: anyMenusEditorDirty,
  drop: () => {
    dropAllWatchMenus();
    dropAllWatchPages();
  },
});

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!anyMenusEditorDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}

/** How often the view asks whether a device has collected a save. */
const DELIVERY_POLL_MS = 15_000;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

/** The Menus and Slots column and the inspector, each widened by dragging
 * the gutter beside it, with the page editor's limits and defaults. */
const ME_COLUMNS = { min: 200, max: 720, middleMin: 320 } as const;
const ME_COLUMNS_DEFAULT: ColumnWidths = { left: 280, right: 320 };
export const ME_COLUMNS_KEY = "wrist-assistant-panel.menus.columns.v1";
/** What a stage click may land on and still keep the selection: anything
 * that does something itself, and the dots and page labels on the watch. */
const STAGE_KEEPS_SELECTION = "button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page";
/** The grid's own cost beside its three columns, CSS px: two 8px gutters and
 * the 2px gap on each side of each. */
const ME_GRID_CHROME = 2 * 8 + 4 * 2;
/** At or below this content width the columns stack and the top bar takes
 * two rows (the `@container` rules on `.layout.pe-layout` say the same). */
const ME_STACK_WIDTH = 820;

type Note = WatchPagesNote;
type HistoryState = "loading" | "ready" | "error" | "unsupported";

interface RestoreAsk {
  entry: WatchConfigHistoryEntry;
  baseRevision: number;
  summary?: string;
  /** The other devices the restore changes too, one line per menu
   * (`menuRestoreLines`). */
  links?: string[];
}

/** The menu name field while it is typed in: the menu it names and the
 * text, sent as a rename once typing stops (`MENU_RENAME_MS`). */
interface MenuNaming {
  menuId: string;
  value: string;
  /** Sent, and kept on screen until the library is read again. */
  sent?: boolean;
}

/** How long after the last keystroke a menu's new name is sent. */
export const MENU_RENAME_MS = 600;

/** The unit a section of the Menus card belongs to: the page switcher is
 * part of the Anywhere menu. */
export function menuUnitOf(menu: MenusSection): MenuUnit {
  return menu === "entity" ? "entity" : "anywhere";
}

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

function isTextField(node: EventTarget | undefined): boolean {
  if (!(node instanceof HTMLElement)) return false;
  return watchKeysTypeText(node.tagName, node instanceof HTMLInputElement ? node.type : undefined, node.isContentEditable);
}

function nothingFocused(): boolean {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active === null || active === document.body || active === document.documentElement;
}

/** The pages a Go to Page slot can open, from the pages record: every page
 * with a UUID id that is not a system page, in watch order. */
export function watchMenuPageTargets(document: unknown): { id: string; name: string }[] {
  if (!isJsonObject(document)) return [];
  return watchPagesOf(document)
    .filter((p) => !isSystemWatchPage(p) && isMenuUUID(watchPageId(p)))
    .map((p) => ({ id: watchPageId(p), name: watchPageName(p) }));
}

/** The colors the watch's page switcher gives a page with no switcher color
 * of its own, by its place in the switcher (`PageSwitcherOverlay.swift`). */
export const WATCH_SWITCHER_COLORS: readonly string[] = ["#8FA8C4", "#9CB6A6", "#C8AE8E", "#A5B7CF", "#D8A3A0", "#A8BED5", "#CCD8E6", "#D8A3A0"];

function filled(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

/** The color a page left out of the switcher is listed in, having no place
 * there to take a color from. */
export const WATCH_SWITCHER_LEFT_OUT_COLOR = "#8E8E93";

/** Every page the watch's page switcher could show, from the pages record,
 * as it would draw them: every page not hidden and not a system page, in
 * watch order, those left out of the switcher marked `hidden`; by its
 * switcher text (else its name) or, set to icon, by its switcher icon (else
 * its first tile's, else the watch's stand-in); in its switcher color, else
 * the switcher's color for its place among the pages it shows. */
export function watchSwitcherRows(document: unknown): MenuSwitcherRow[] {
  if (!isJsonObject(document)) return [];
  let place = 0;
  return watchPagesOf(document)
    .filter((p) => !isHiddenWatchPage(p) && !isSystemWatchPage(p))
    .map((p) => {
      const hidden = p.hideFromSwitcher === true;
      const name = watchPageName(p);
      const icon = filled(p.switcherIcon) ?? filled(watchPageTiles(p)[0]?.icon) ?? (isSmartWatchPage(p) ? "bolt.fill" : "square.grid.2x2.fill");
      const byPlace = hidden ? WATCH_SWITCHER_LEFT_OUT_COLOR : WATCH_SWITCHER_COLORS[place++ % WATCH_SWITCHER_COLORS.length]!;
      const color = filled(p.switcherColor) ?? byPlace;
      const text = p.switcherDisplayMode === "icon" ? undefined : filled(p.switcherText) ?? name;
      return { id: watchPageId(p), name, icon, color, ...(text === undefined ? {} : { text }), hidden };
    });
}

/** The pages the watch's page switcher shows, as it draws them: the rows of
 * `watchSwitcherRows` not left out of it. */
export function watchSwitcherPages(document: unknown): MenuSwitcherPage[] {
  return watchSwitcherRows(document).filter((p) => !p.hidden).map(({ hidden: _, ...page }) => page);
}

const NOTE_WEIGHT: Readonly<Record<WatchPagesNote["kind"], number>> = { ok: 0, warn: 1, err: 2 };

/** The note after a save of the menus and the pages: each one's words, both
 * in one line when both said something (once when they said the same), in
 * the graver of the two kinds. */
export function joinSaveNotes(menus: WatchPagesNote | undefined, pages: WatchPagesNote | undefined): WatchPagesNote | undefined {
  if (menus === undefined) return pages;
  if (pages === undefined) return menus;
  const kind = NOTE_WEIGHT[pages.kind] > NOTE_WEIGHT[menus.kind] ? pages.kind : menus.kind;
  return { kind, text: menus.text === pages.text ? menus.text : `${menus.text} ${pages.text}` };
}

/** A restore's one line: how many slots each menu holds. */
export function watchMenusSummary(document: unknown): string {
  const doc = asWatchMenusDocument(document) ?? {};
  const anywhere = watchMenuSlots(doc, { list: "anywhere" }).length;
  const overrides = watchMenuOverrideIds(doc).length;
  const slots = (n: number) => `${n} ${n === 1 ? "slot" : "slots"}`;
  return `Anywhere menu: ${slots(anywhere)}. ${overrides === 0 ? "No entity has its own menu." : `${overrides} ${overrides === 1 ? "entity has" : "entities have"} its own menu.`}`;
}

export class WaMenuEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownerId?: string;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  /** The top bar offers Home Assistant's menu, as the panel's own bar does on
   * a phone or with the sidebar hidden (`hook.ts`). */
  @property({ attribute: false }) haMenu = false;
  @property({ attribute: false }) onHaMenu?: () => void;
  /** Back to the complication editor. Without it, the address less `/menus`. */
  @property({ attribute: false }) onBack?: () => void;
  /** To the page editor. Without it, the address's `/menus` made `/pages`. */
  @property({ attribute: false }) onPages?: () => void;
  /** The panel's own buttons for the bar's right end: Watch settings, whose
   * dialog the panel draws. */
  @property({ attribute: false }) barActions: TemplateResult | typeof nothing = nothing;
  /** The panel's Watch app row owns the watch: it picks the watch (this
   * element follows `ownerId` wherever it goes) and holds the ways to the
   * other screens, so the bar leaves out its own watch picker, the way back
   * to complications and Pages. Off, the bar is as it always was. */
  @property({ attribute: false }) shellOwnsWatch = false;
  /** The home keeps phone pages (`phone-pages.ts`): an iPhone is a device
   * this element opens too, on its own menus. */
  @property({ attribute: false }) phones = false;
  /** The box in the panel's Watch app header the bar is drawn in
   * (`head-bar.ts`). Without one the bar is drawn on top, as it always was. */
  @property({ attribute: false }) barHost: HTMLElement | undefined = undefined;
  /** Library mode (`library/item-mode.ts`): this one menu, edited in the
   * library with no device. `watchId` is then only the device it is drawn
   * on ("Preview on"), which also lends its catalog, behavior, voice,
   * status pages and pages; the draft is kept under `libraryDraftKey`, and
   * only the menu's own unit is shown and saved. */
  @property({ attribute: false }) libraryItem: LibraryItemRef | undefined = undefined;
  private readonly headBar = new HeadBar(this);

  @state() private watchId?: string;
  /** The library menu open now, in library mode. */
  private openedItem?: LibraryItemRef;
  /** The summary revision a quiet read was last asked for. */
  private followedRevision?: number;
  /** The library menu whose unit the Menus card was turned to. */
  private shownUnitFor?: string;
  /** Library mode's Delete asks first, in the menu's row. */
  @state() private menuDeleteAsk = false;
  @state() private record?: WatchConfigRecord;
  /** The integration does not keep menus (too old for the kind). */
  @state() private unsupported = false;
  @state() private catalog?: WatchCatalog;
  /** The watch's own status pages (the `status_pages` record), which the
   * Show Status Page target lists before the iPhone's; undefined while Home
   * Assistant holds none or before the first read. */
  @state() private statusPages?: WatchCatalogStatusPage[];
  /** The home's HTTP action library (`http-library.ts`), the same for every
   * watch, read when a watch opens and on a reconnect (it has no live line);
   * undefined before the first read and with an integration older than it. */
  @state() private httpLibrary?: WatchHttpLibrary;
  private httpLibrarySeq = 0;
  /** The pages record as last read: its revision (0 for none) and the
   * document. Undefined before the first read. The pages shown come from the
   * page draft when there is one (`pagesDocument`). */
  @state() private pagesRecord?: { revision: number; document: unknown };
  /** The watch's behavior settings, read only. The Entity quick menu's
   * gestures live there; batch 1 shows none of them. */
  @state() private behavior?: Readonly<Record<string, unknown>>;
  /** The watch's voice settings (the `voice` record), read only: its phrases
   * for Speak Phrase and Pick from List, its defaults behind a slot's voice.
   * Undefined while there is none, before the read, and after a failed one. */
  @state() private voiceDocument?: Readonly<Record<string, unknown>>;
  private voiceSeq = 0;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private history: WatchConfigHistoryEntry[] = [];
  @state() private historyState: HistoryState = "loading";
  @state() private note?: Note;
  @state() private restoreAsk?: RestoreAsk;
  @state() private restoring = false;
  /** The foot bar's History dialog is open (`config-foot.ts`). */
  @state() private historyOpen = false;
  /** The foot bar's Raw configuration dialog is open. */
  @state() private rawOpen = false;
  /** The raw JSON went to the clipboard since the dialog opened. */
  @state() private rawCopied = false;
  /** The foot bar's dialogs opened so far, each once. */
  private readonly shownFootDialogs = new WeakSet<HTMLDialogElement>();
  @state() private ownList?: readonly OwnerSummary[];
  /** The top bar's ··· menu is open. */
  @state() private topMenuOpen = false;
  /** The top bar's watch picker is open. */
  @state() private watchMenuOpen = false;
  /** The library (`library/store.ts`): every menu once, its name and the
   * devices that use it, read from `library/summary` and read again when a
   * device's menus change. Undefined before the first read and on an
   * integration older than the library, which leaves the name, Used by and
   * the copy off. */
  private readonly lib = new LibraryController(this, () => this.hass, () => this.linkDevices.map((d) => d.ownerId));
  /** The menu name field while it is typed in. */
  @state() private naming?: MenuNaming;
  private renameTimer?: ReturnType<typeof setTimeout>;
  /** "Make a copy for this watch" is out. */
  @state() private copying = false;
  /** What the library line said after its last write (a copy). */
  @state() private libNote?: Note;
  /** The stage's scale as stepped with the zoom buttons, undefined while it
   * fits (`stageFitZoom`). Remembered between visits (`MENUS_ZOOM_KEY`). */
  @state() private zoom = loadMenusZoom();
  /** The side columns' widths as dragged (a preference, saved), and the
   * host's measured content width and height, which fit them and cap the
   * self-scrolling columns. Zero before the first measurement. */
  @state() private columns: ColumnWidths = { ...ME_COLUMNS_DEFAULT };
  @state() private hostWidth = 0;
  @state() private hostHeight = 0;
  private ownListAsked = false;
  private sizeObserver?: ResizeObserver;
  /** The sticky block at the top (the bar and a note under it) the observer
   * measures, and its height, written to `--pe-top-h` on the host for the
   * sticky columns under it. */
  private observedTop?: HTMLElement;
  private topHeight = 0;
  /** Draws again while the toolbar says "Saved 3 min ago". */
  private readonly savedTicker = new SavedAgoTicker(this);

  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());
  private readonly uiState = new Map<string, unknown>();
  private iconMemo?: { provider: IconProvider; tick: number; icons: IconProvider };
  /** The coalesce key of a drag on a number field running now. */
  private scrubKey?: string;
  private scrubSeq = 0;
  private reloadPending = false;
  private restartDraft?: { watchId: string; revision: number };
  private followedSave?: Promise<unknown>;
  /** The page draft's save this element follows (its own, or one the page
   * editor began), to read the pages again when it ends. */
  private followedPagesSave?: Promise<unknown>;
  private shownDialog?: HTMLDialogElement;
  private loadSeq = 0;
  private catalogSeq = 0;
  private statusPagesSeq = 0;
  private pagesSeq = 0;
  private behaviorSeq = 0;
  private historySeq = 0;
  private subscribeSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private pollTimer?: number;
  private readyConnection?: HassConnectionEvents;

  private get watches(): OwnerSummary[] {
    return watchAppDevices(this.owners.length > 0 ? this.owners : (this.ownList ?? []), this.phones);
  }

  /** The shown device, for the lines that name it. */
  private get device(): SettingDevice {
    // In library mode Preview on decides, so an iPhone is drawn with no
    // iPhone in the home too.
    if (this.libraryItem !== undefined) return this.previewKind;
    return isPhoneId(this.watches, this.watchId) ? "iphone" : "watch";
  }

  /** Library mode's Preview on: the kind of device drawn on. `watchId` is
   * then the home's first device of that kind, or undefined with none. */
  @state() private previewKind: PreviewKind = "watch";

  /** The menus being edited. While Home Assistant holds none for the watch
   * it is the new watch's ready draft (`new-watch.ts`), on the defaults at
   * revision 0 and unsaved, once the screen opens ready; none while it waits
   * for the iPhone. */
  private get draft(): WatchMenusDraft | undefined {
    const watchId = this.recordKey;
    const record = this.record;
    if (watchId === undefined || record === undefined) return undefined;
    if (record.revision > 0) {
      // Made from the record when none is kept (the panel's leave guard may
      // have dropped it); none for a record this panel cannot read.
      const kept = keptWatchMenusDraft(watchId);
      if (kept !== undefined) return kept;
      const document = asWatchMenusDocument(record.document);
      return document === undefined ? undefined : takeWatchMenusRecord(watchId, document, record.revision).draft;
    }
    if (this.libraryItem !== undefined || this.unsupported || !this.opensReady()) return undefined;
    return keptWatchMenusDraft(watchId) ?? newWatchMenusDraft(watchId);
  }

  /** What the menus record and its kept draft are keyed by: the device's
   * id, or in library mode the menu's `libraryDraftKey`. */
  private get recordKey(): string | undefined {
    return this.libraryItem === undefined ? this.watchId : libraryDraftKey(this.libraryItem);
  }

  /** In library mode, the menu's unit, from the summary: undefined before
   * it is read. */
  private get libraryUnit(): MenuUnit | undefined {
    const item = this.libraryItem;
    const lib = this.lib.library;
    return item === undefined || lib === undefined ? undefined : libraryMenu(lib, item.id)?.unit;
  }

  /** Home Assistant holds no menus for the watch: the ready screen's banner,
   * and Save's reason while there is nothing to save. */
  private get newWatch(): boolean {
    const record = this.record;
    return record !== undefined && record.revision <= 0 && !this.unsupported;
  }

  /**
   * The page draft kept for the watch (`watch-pages/kept.ts`), shared with
   * the page editor, so an unsaved page edit made there is here before the
   * pages record is read, and one made here is there. None once the read
   * says Home Assistant holds no pages for the watch.
   */
  private get pagesDraft(): WatchPagesDraft | undefined {
    // In library mode the pages are the preview device's, read only.
    if (this.libraryItem !== undefined) return undefined;
    if (this.watchId === undefined || (this.pagesRecord !== undefined && this.pagesRecord.revision <= 0)) return undefined;
    return keptWatchPagesDraft(this.watchId);
  }

  /** The pages as edited now: the page draft's, else the record's. */
  private get pagesDocument(): unknown {
    const record = this.pagesRecord;
    return this.pagesDraft?.document ?? (record !== undefined && record.revision > 0 ? record.document : undefined);
  }

  /** The pages a Go to Page slot can open, worked out on every draw so an
   * edit shows at once. */
  private get pages(): { id: string; name: string }[] {
    return watchMenuPageTargets(this.pagesDocument);
  }

  /** Either draft is being saved: every field is drawn off then. */
  private get saving(): boolean {
    const key = this.recordKey;
    if (key === undefined) return false;
    return (keptWatchMenusDraft(key)?.saving ?? false) || (this.pagesDraft?.saving ?? false);
  }

  /** Unsaved edits to the menus or to the pages: the Save button, its
   * "Unsaved changes" and Discard edits. */
  private get dirty(): boolean {
    return (this.draft?.dirty ?? false) || (this.pagesDraft?.dirty ?? false);
  }

  /** The draft Undo and Redo work on: the pages while a page is picked in the
   * switcher's Pages card, else the menus. */
  private get undoDraft(): WatchMenusDraft | WatchPagesDraft | undefined {
    const pages = this.pagesDraft;
    if (pages !== undefined && this.pickedSwitcherPage() !== undefined) return pages;
    return this.draft;
  }

  /** The page picked in the switcher's Pages card, while the switcher is
   * shown and the page is still there. */
  private pickedSwitcherPage(): MenuSwitcherRow | undefined {
    return selectedSwitcherPage({ uiState: this.uiState, switcherPages: [], switcherRows: watchSwitcherRows(this.pagesDocument) });
  }

  private get holdReload(): boolean {
    return this.saving || this.scrubKey !== undefined;
  }

  constructor() {
    super();
    this.addEventListener(SCRUB_START, this.onScrubStart);
    this.addEventListener(SCRUB_END, this.onScrubEnd);
    this.addEventListener("focusout", () => {
      this.draft?.endCoalesce();
      this.pagesDraft?.endCoalesce();
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // The bar goes back into the header on the next draw.
    if (this.barHost !== undefined) this.requestUpdate();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onWindowPointerDown, true);
    this.columns = loadColumnWidths(ME_COLUMNS_KEY, ME_COLUMNS_DEFAULT, ME_COLUMNS);
    this.watchSize();
    this.listenForReconnect();
    if (this.openedItem !== undefined) {
      this.openPreview(this.watchId);
      this.openItem(true);
    } else if (this.watchId !== undefined) this.openWatch(this.watchId, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.headBar.clear();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointerdown", this.onWindowPointerDown, true);
    this.sizeObserver?.disconnect();
    this.observedTop = undefined;
    this.stopListeningForReconnect();
    this.reloadPending = false;
    this.endScrub();
    this.endSubscription();
    this.stopPolling();
    this.loadSeq++;
    this.catalogSeq++;
    this.statusPagesSeq++;
    this.httpLibrarySeq++;
    this.pagesSeq++;
    this.behaviorSeq++;
    this.voiceSeq++;
    this.historySeq++;
    this.flushRename();
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
      if (this.libraryItem !== undefined) this.followLibraryItem(this.libraryItem);
      else {
        if (this.openedItem !== undefined) {
          this.openedItem = undefined;
          this.watchId = undefined;
        }
        // A move takes the watch's kept menu draft and its kept page draft
        // together (`openWatch`), so both stay as they were on the watch left.
        const id = followWatch(this.watches, this.watchId, this.ownerId, this.shellOwnsWatch || changed.has("ownerId"));
        if (id !== undefined) this.openWatch(id);
      }
    }
    this.followSave();
    const ask = this.restoreAsk;
    if (ask !== undefined && !this.restoring && this.historyState === "ready" && !this.history.some((e) => e.revision === ask.entry.revision)) {
      this.closeAsk();
    }
  }

  protected override updated(): void {
    this.headBar.draw(this.barHost, () => this.renderTopBar(this.draft, this.watches));
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask") ?? undefined;
    if (dialog !== this.shownDialog) {
      this.shownDialog = dialog;
      if (dialog && !dialog.open) dialog.showModal();
    }
    openConfigDialogs(this.renderRoot, this.shownFootDialogs);
    this.observeTop();
    this.savedTicker.show(this.headBar.query(this.renderRoot, ".cf-saved") !== null
      || this.renderRoot.querySelector(".cf-saved") !== null);
  }

  /** Measure the host, not the window: the Home Assistant sidebar changes
   * the editor's width without changing the window's. Its height caps the
   * side columns, which scroll on their own past it. The sticky top block is
   * measured by the same observer. */
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
        if (Math.abs(box.height - this.hostHeight) >= 1) this.hostHeight = box.height;
      }
    });
    this.sizeObserver.observe(this);
    this.observeTop();
  }

  /** Watch the sticky top block's height; after every draw, since a
   * reconnect starts the observer over. Nothing to do for the same block. */
  private observeTop(): void {
    const observer = this.sizeObserver;
    if (observer === undefined) return;
    const top = this.renderRoot?.querySelector<HTMLElement>(".pe-top") ?? undefined;
    if (top === this.observedTop) return;
    if (this.observedTop !== undefined) observer.unobserve(this.observedTop);
    this.observedTop = top;
    if (top !== undefined) observer.observe(top);
  }

  /** The top block's whole height onto the host, for CSS: no draw follows. */
  private measureTop(top: HTMLElement): void {
    const height = top.offsetHeight;
    if (height === this.topHeight) return;
    this.topHeight = height;
    this.style.setProperty("--pe-top-h", `${height}px`);
  }

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
    const key = this.recordKey;
    if (this.isConnected && key !== undefined && this.libraryItem !== undefined) void this.load(key, true);
    const watchId = this.watchId;
    if (!this.isConnected || watchId === undefined) return;
    if (this.libraryItem === undefined) void this.load(watchId, true);
    void this.loadCatalog(watchId);
    void this.loadHttpLibrary();
    void this.loadStatusPages(watchId);
    void this.loadPages(watchId);
    void this.loadBehavior(watchId);
    void this.loadVoice(watchId);
    void this.lib.store?.refresh();
  };

  private followSave(): void {
    const watchId = this.watchId;
    const pagesDone = this.pagesDraft?.saveDone;
    if (watchId !== undefined && pagesDone !== undefined && pagesDone !== this.followedPagesSave) {
      this.followedPagesSave = pagesDone;
      const ended = (): void => this.pagesSaveEnded(watchId);
      void pagesDone.then(ended, ended);
    }
    const key = this.recordKey;
    if (key === undefined) return;
    const done = keptWatchMenusDraft(key)?.saveDone;
    if (done === undefined || done === this.followedSave) return;
    this.followedSave = done;
    const ended = (): void => this.saveEnded(key);
    void done.then(ended, ended);
  }

  /** A save of the page draft ended: the pages are read again (the read
   * skipped while it was out), and a menus reload held for it goes ahead. */
  private pagesSaveEnded(watchId: string): void {
    this.requestUpdate();
    if (!this.isConnected || watchId !== this.watchId) return;
    void this.loadPages(watchId);
    this.flushPending();
  }

  private saveEnded(watchId: string): void {
    this.requestUpdate();
    if (!this.isConnected) return;
    if (watchId === this.recordKey) {
      this.reloadPending = false;
      void this.load(watchId, true);
    } else {
      this.flushPending();
    }
  }

  // ── library mode ───────────────────────────────────────────────────────

  /** Library mode: the preview device (the shown one while it is in the
   * home, else the remembered one, else the first watch), the menu read
   * when it changes, the Menus card turned to its unit once the summary
   * names it, and the menu read again quietly once the summary says it
   * moved on elsewhere. */
  private followLibraryItem(ref: LibraryItemRef): void {
    if (!sameLibraryItem(ref, this.openedItem)) this.previewKind = storedPreviewKind();
    const preview = previewOwner(this.watches, this.previewKind);
    if (preview !== this.watchId || (preview === undefined && this.openedItem === undefined)) this.openPreview(preview);
    if (!sameLibraryItem(ref, this.openedItem)) {
      this.openedItem = ref;
      this.openItem();
    }
    const key = libraryDraftKey(ref);
    const unit = this.libraryUnit;
    if (unit !== undefined && this.shownUnitFor !== key) {
      this.shownUnitFor = key;
      showMenuSettings({ uiState: this.uiState, requestUpdate: () => this.requestUpdate() }, unit);
    }
    const moved = summaryRevision(this.lib.library, ref);
    const shown = this.record?.revision;
    if (moved !== undefined && shown !== undefined && moved > shown && moved !== this.followedRevision) {
      this.followedRevision = moved;
      void this.load(key, true);
    }
  }

  /** Preview on: the kind picked, drawn on the home's first device of it. */
  private pickPreview(kind: PreviewKind): void {
    this.previewKind = kind;
    this.openPreview(previewOwner(this.watches, kind));
  }

  /** Library mode's device to draw on: its catalog, HTTP actions, status
   * pages, pages, behavior and voice are read and followed, for the slot
   * pickers and the page switcher. Its menus are never read. */
  private openPreview(watchId: string | undefined): void {
    this.watchId = watchId;
    this.catalog = undefined;
    this.catalogSeq++;
    this.statusPages = undefined;
    this.statusPagesSeq++;
    this.pagesRecord = undefined;
    this.pagesSeq++;
    this.behavior = undefined;
    this.behaviorSeq++;
    this.voiceDocument = undefined;
    this.voiceSeq++;
    if (watchId === undefined) this.endSubscription();
    else this.startSubscription(watchId);
    this.loadContext(watchId);
  }

  /** Open the library menu: as `openWatch` does for a device, but with no
   * history and no delivery. */
  private openItem(quiet = false): void {
    const key = this.recordKey;
    if (key === undefined) return;
    if (!quiet) {
      this.reloadPending = false;
      this.restartDraft = undefined;
      this.note = undefined;
      this.unsupported = false;
      this.history = [];
      this.closeAsk();
      this.flushRename();
      this.libNote = undefined;
      this.menuDeleteAsk = false;
      this.endScrub();
      this.uiState.clear();
      this.shownUnitFor = undefined;
      this.followedRevision = undefined;
    }
    this.stopPolling();
    void this.load(key, quiet);
  }

  // ── loading ────────────────────────────────────────────────────────────

  private openWatch(watchId: string, quiet = false): void {
    if (watchId !== this.watchId) {
      this.reloadPending = false;
      this.restartDraft = undefined;
      this.watchId = watchId;
      this.note = undefined;
      this.unsupported = false;
      this.catalog = undefined;
      this.catalogSeq++;
      this.statusPages = undefined;
      this.statusPagesSeq++;
      // The new watch's kept page draft, if any, shows until its record is
      // read (`pagesDraft`). Clearing `uiState` below lets go of the picked
      // page with the rest.
      this.pagesRecord = undefined;
      this.pagesSeq++;
      this.behavior = undefined;
      this.behaviorSeq++;
      this.voiceDocument = undefined;
      this.voiceSeq++;
      this.history = [];
      if (this.historyState !== "unsupported") this.historyState = "loading";
      this.closeAsk();
      this.flushRename();
      this.libNote = undefined;
      this.endScrub();
      this.uiState.clear();
      quiet = false;
    }
    // A card on the Menus tab opened this device on one menu.
    const asked = takeWatchMenuAsk(watchId);
    if (asked !== undefined) showMenuSettings({ uiState: this.uiState, requestUpdate: () => this.requestUpdate() }, asked);
    this.startSubscription(watchId);
    void this.load(watchId, quiet);
    this.loadContext(watchId);
  }

  /** What the slot pickers and the page switcher read beside the menus: the
   * home's HTTP actions, and the device's catalog, status pages, pages,
   * behavior and voice (none of those with no device, in library mode). */
  private loadContext(watchId: string | undefined): void {
    void this.loadHttpLibrary();
    if (watchId === undefined) return;
    void this.loadCatalog(watchId);
    void this.loadStatusPages(watchId);
    void this.loadPages(watchId);
    void this.loadBehavior(watchId);
    void this.loadVoice(watchId);
  }

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

  /** The voice settings as the slot editors read them. */
  private voiceContext(): MenuVoiceContext {
    const document = this.voiceDocument;
    return {
      phrases: document === undefined ? undefined : voicePhraseTargets(document),
      defaults: watchVoiceFallbacks(document, this.catalog),
    };
  }

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
      if (watchCatalogReadMeansNone(error)) this.catalog = undefined;
    }
  }

  /** The home's HTTP action library, for the Run HTTP Action target. An
   * integration older than it does not know the command: none, and the
   * target lists the iPhone's catalog alone. Any other failure keeps what
   * is shown. Only the newest read lands. */
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

  /** The watch's own status pages, for the Show Status Page target. An
   * integration too old for the kind refuses it: none, and the iPhone's list
   * stands. Any other failure keeps what is shown. */
  private async loadStatusPages(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.statusPagesSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "status_pages");
      if (seq !== this.statusPagesSeq || watchId !== this.watchId) return;
      this.statusPages = watchStatusPagesFromRecord(record);
    } catch (error) {
      if (seq !== this.statusPagesSeq || watchId !== this.watchId) return;
      if (watchCatalogReadMeansNone(error)) this.statusPages = undefined;
    }
  }

  private async loadPages(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.pagesSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "pages");
      if (seq !== this.pagesSeq || watchId !== this.watchId) return;
      this.pagesRecord = { revision: record.revision, document: record.document };
      // Into the page draft the page editor keeps too, rebasing any edits
      // onto it. Not while that draft is being saved: the record may be the
      // save's own, and the save reads the pages again when it ends.
      // Library mode only reads the preview device's pages, never touching
      // its kept page draft.
      if (this.libraryItem === undefined && record.revision > 0 && isJsonObject(record.document) && !(keptWatchPagesDraft(watchId)?.saving ?? false)) {
        const taken = takeWatchPagesRecord(watchId, record.document as WatchPagesDocument, record.revision);
        if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The pages changed elsewhere. Your edits are kept." };
      }
    } catch {
      // A failed read keeps the pages shown: the picker still saves ids.
    }
  }

  private async loadBehavior(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.behaviorSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "behavior");
      if (seq !== this.behaviorSeq || watchId !== this.watchId) return;
      this.behavior = record.revision > 0 && isJsonObject(record.document) ? record.document : undefined;
    } catch {
      if (seq !== this.behaviorSeq || watchId !== this.watchId) return;
      this.behavior = undefined;
    }
  }

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
    const item = this.libraryItem;
    try {
      const record = item !== undefined ? await fetchLibraryRecord(hass, item) : await fetchWatchConfig(hass, watchId, "menus");
      if (seq !== this.loadSeq) return;
      if (quiet && this.holdReload) {
        this.reloadPending = true;
        return;
      }
      this.unsupported = false;
      this.show(record);
      this.loadError = undefined;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      if (item !== undefined) {
        if (!quiet) this.loadError = libraryErrorText(err);
      } else if (watchMenusReadMeansUnsupported(err)) {
        this.unsupported = true;
        this.loadError = undefined;
      } else if (!quiet) {
        this.loadError = errText(err);
      }
      if (this.restartDraft?.watchId === watchId) this.restartDraft = undefined;
    }
    this.loading = false;
    // A library menu has no delivery and no earlier saves of its own.
    if (this.unsupported || item !== undefined) return;
    this.pollIfWaiting();
    void this.loadHistory(watchId);
  }

  private flushPending(): void {
    const key = this.recordKey;
    if (!this.reloadPending || this.holdReload || key === undefined) return;
    this.reloadPending = false;
    void this.load(key, true);
  }

  private show(record: WatchConfigRecord): void {
    const watchId = this.recordKey;
    this.record = record;
    // No menus here: a kept draft from an earlier record moves onto the
    // defaults at revision 0, its edits kept, so its first save makes the
    // record (`newWatchMenusDraft`).
    if (watchId !== undefined && record.revision <= 0) newWatchMenusDraft(watchId);
    const document = record.revision > 0 ? asWatchMenusDocument(record.document) : undefined;
    if (watchId === undefined || document === undefined) return;
    const restart = this.restartDraft;
    if (restart !== undefined && restart.watchId === watchId && record.revision >= restart.revision) {
      this.restartDraft = undefined;
      if (!(keptWatchMenusDraft(watchId)?.dirty ?? false)) forgetWatchMenusDraft(watchId);
    }
    const taken = takeWatchMenusRecord(watchId, document, record.revision);
    if (taken.replaced.length > 0) this.note = { kind: "warn", text: watchMenusReplacedText(taken.replaced) };
    else if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The menus changed somewhere else. Your edits are kept." };
    this.requestUpdate();
  }

  private async loadHistory(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass || this.historyState === "unsupported") return;
    const seq = ++this.historySeq;
    try {
      const reply = await fetchWatchConfigHistory(hass, watchId, "menus");
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.history = Array.isArray(reply?.entries) ? reply.entries : [];
      this.historyState = "ready";
    } catch (err) {
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.historyState = errCode(err) === "unknown_command" ? "unsupported" : "error";
    }
  }

  /** Hear every save of this watch's config: a new `menus` revision is read
   * and merged into the draft; `catalog`, `pages` and `behavior` are read
   * again for the pickers. */
  private startSubscription(watchId: string): void {
    const hass = this.hass;
    this.endSubscription();
    if (!hass) return;
    const seq = ++this.subscribeSeq;
    subscribeWatchConfig(hass, watchId, (event) => {
      if (seq !== this.subscribeSeq) return;
      if (event.kind === "catalog") {
        if (watchCatalogEventIsNews(event, this.catalog)) void this.loadCatalog(watchId);
      } else if (event.kind === "status_pages") {
        void this.loadStatusPages(watchId);
      } else if (event.kind === "pages") {
        void this.loadPages(watchId);
      } else if (event.kind === "behavior") {
        void this.loadBehavior(watchId);
      } else if (event.kind === "voice") {
        void this.loadVoice(watchId);
      } else if (event.kind === "menus") {
        // In library mode the device's menus are not what is open.
        if (this.libraryItem === undefined && event.revision !== (this.record?.revision ?? 0)) void this.load(watchId, true);
      }
    }).then(
      (unsubscribe) => {
        if (seq === this.subscribeSeq) this.unsubscribe = unsubscribe;
        else void unsubscribe().catch(() => undefined);
      },
      () => undefined,
    );
  }

  private endSubscription(): void {
    this.subscribeSeq++;
    const unsubscribe = this.unsubscribe;
    this.unsubscribe = undefined;
    void unsubscribe?.().catch(() => undefined);
  }

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
      const fresh = await fetchWatchConfig(hass, watchId, "menus");
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
      // A missed check is not news.
    }
    this.pollIfWaiting();
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) window.clearTimeout(this.pollTimer);
    this.pollTimer = undefined;
  }

  // ── editing ────────────────────────────────────────────────────────────

  private edit(change: (document: MenusDocument) => MenusDocument, coalesce?: string): boolean {
    const draft = this.draft;
    if (!draft || this.saving) return false;
    const changed = draft.apply(change(draft.document), this.scrubKey ?? coalesce);
    // A refused edit draws too, so a field that shows its own new value (a
    // select) goes back to the document's.
    this.requestUpdate();
    return changed;
  }

  /** Apply `change` to the page draft, as `edit` does to the menus: one undo
   * step, or with `coalesce` a step the next edits with that key replace
   * (typing in one field). */
  private editPages(change: (document: WatchPagesDocument) => WatchPagesDocument, coalesce?: string): boolean {
    const draft = this.pagesDraft;
    if (!draft || this.saving) return false;
    const key = this.scrubKey ?? coalesce;
    const changed = draft.apply(change(draft.document), key === undefined ? undefined : { coalesce: key });
    this.requestUpdate();
    return changed;
  }

  private onScrubStart = (e: Event): void => {
    e.stopPropagation();
    this.endScrub();
    this.draft?.endCoalesce();
    this.scrubKey = `scrub:${++this.scrubSeq}`;
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

  private endScrub(): void {
    window.removeEventListener("pointerup", this.onScrubPointerUp, true);
    window.removeEventListener("pointercancel", this.onScrubPointerUp, true);
    if (this.scrubKey === undefined) return;
    this.scrubKey = undefined;
    this.draft?.endCoalesce();
    this.flushPending();
  }

  private memoIcons(): IconProvider {
    const provider = this.icons ?? NO_ICONS;
    const memo = this.iconMemo;
    if (memo !== undefined && memo.provider === provider && memo.tick === this.iconsTick) return memo.icons;
    const icons = memoIconNames(provider);
    this.iconMemo = { provider, tick: this.iconsTick, icons };
    return icons;
  }

  private targets(): MenuTargets {
    return {
      pages: this.pages,
      // The watch's own status pages first, else the iPhone's list.
      statusPages: this.statusPages ?? this.catalog?.statusPages ?? [],
      // The home's library first, then the iPhone's own.
      httpActions: watchCatalogWithHttpLibrary(this.catalog, this.httpLibrary)?.httpActions ?? [],
      // Unknown, not empty, while Home Assistant holds no voice settings: a
      // Speak Phrase slot's phrase may well be on the iPhone.
      phrases: this.voiceDocument === undefined ? undefined : voicePhraseTargets(this.voiceDocument),
    };
  }

  /** The open watch's screen in points, as the page editor finds it: the
   * size the watch reported, else the 46 mm reference. */
  private screen(): MenusScreen {
    const phone = this.phoneLayout();
    if (phone !== undefined) return phonePagesScreen(phone);
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    return (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).screen;
  }

  /** On an iPhone, where its Pages tab lays itself out: the menus open over
   * its pages area (`phone-frame.ts`). Undefined on a watch. */
  private phoneLayout(): PhonePagesLayout | undefined {
    if (this.device !== "iphone") return undefined;
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    return phonePagesLayout(phoneModelForScreenSize(owner?.screen_size));
  }

  private viewHost(): MenusViewHost | undefined {
    const draft = this.draft;
    const hass = this.hass;
    if (draft === undefined || hass === undefined) return undefined;
    const self = this;
    // Worked out from the pages as edited now, on every draw, so a switcher
    // edit shows at once in the Pages card and on the watch.
    const rows = watchSwitcherRows(this.pagesDocument);
    return {
      hass,
      icons: this.memoIcons(),
      symbols: this.symbols,
      uiState: this.uiState,
      screen: this.screen(),
      // An iPhone is drawn at half the watch's zoom, so the taller phone fits.
      scale: this.phoneLayout() === undefined ? this.stageScale : this.stageScale * PHONE_STAGE_ZOOM,
      ...(this.phoneLayout() === undefined ? {} : { phone: this.phoneLayout() }),
      switcherPages: rows.filter((p) => !p.hidden).map(({ hidden: _, ...page }) => page),
      switcherRows: rows,
      switcherSettings: (pageId) => this.switcherSettingsHost(pageId),
      menuFoot: (menu) => (menu === "switcher" ? nothing : this.libraryHead(menu)),
      menuBadge: (menu) => this.menuBadge(menu),
      ...(this.libraryUnit === undefined ? {} : { sections: librarySections(this.libraryUnit) }),
      get document() { return draft.document; },
      get targets() { return self.targets(); },
      get catalogKnown() { return self.catalog !== undefined; },
      get httpLibrary() { return self.httpLibrary === undefined ? undefined : self.httpLibrary.revision > 0 ? "held" as const : "empty" as const; },
      get statusPagesKnown() { return self.statusPages !== undefined; },
      get voice() { return self.voiceContext(); },
      get device() { return self.device; },
      get busy() { return self.saving; },
      edit: (change, coalesce) => this.draft === draft && this.edit(change, coalesce),
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => this.requestUpdate(),
    };
  }

  /**
   * The host of one page's switcher settings, editing the page draft: `page`
   * and `busy` read the draft each time they are read. Undefined while there
   * is no page draft or the page is not in it.
   */
  private switcherSettingsHost(pageId: string): SwitcherSettingsHost | undefined {
    const draft = this.pagesDraft;
    if (draft === undefined || findWatchPage(draft.document, pageId) === undefined) return undefined;
    const self = this;
    const icons = this.memoIcons();
    return {
      pageId,
      icons,
      symbols: this.symbols,
      uiState: this.uiState,
      get device() { return self.device; },
      // The page as the draft has it now; an empty one when an undo took it
      // away mid-task, so a row's handler still has a page to read (its
      // setters then change nothing).
      get page() { return findWatchPage(draft.document, pageId) ?? {}; },
      get busy() { return self.saving; },
      edit: (change, opts) => {
        if (this.pagesDraft === draft) this.editPages(change, opts?.typing === true ? `switcher:${pageId.toUpperCase()}` : undefined);
      },
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => this.requestUpdate(),
    };
  }

  private undo(): void {
    if (this.undoDraft?.undo()) this.requestUpdate();
  }

  private redo(): void {
    if (this.undoDraft?.redo()) this.requestUpdate();
  }

  /** Back to the copies Home Assistant holds, menus and pages, each as one
   * step its own undo takes back. */
  private discard(): void {
    if (this.saving) return;
    const menus = this.draft?.discard() ?? false;
    const pages = this.pagesDraft?.discard() ?? false;
    if (menus || pages) {
      this.note = { kind: "ok", text: "Edits discarded. Undo brings them back." };
      this.requestUpdate();
    }
  }

  /**
   * Save what holds edits: the menus, then the pages (a page's switcher
   * settings), each its own record. One failing does not keep the other
   * from saving. The note says how each ended, both in one line.
   */
  private async save(): Promise<void> {
    const hass = this.hass;
    // In library mode the menu alone: there is no page draft.
    const watchId = this.recordKey;
    this.endScrub();
    const draft = this.draft;
    const pages = this.pagesDraft;
    if (!hass || watchId === undefined || !draft || this.saving) return;
    const menusDirty = draft.dirty;
    const pagesDirty = pages?.dirty ?? false;
    if (!menusDirty && !pagesDirty) return;
    this.note = undefined;
    // A first save over revision 0 that Home Assistant refuses as
    // `no_record` means the watch is not paired (`firstSaveNote`).
    const menusNote = menusDirty ? await this.saveMenus(hass, watchId, draft, draft.revision <= 0) : undefined;
    const pagesNote = pagesDirty && pages !== undefined && this.pagesDraft === pages ? await this.savePages(hass, watchId, pages) : undefined;
    if (watchId === this.recordKey) this.note = joinSaveNotes(menusNote, pagesNote);
  }

  /** Save the menus draft; the note for how it ended, or none. */
  private async saveMenus(hass: HassLike, watchId: string, draft: WatchMenusDraft, first = false): Promise<Note | undefined> {
    // The other devices on this menu Home Assistant could not bring up to
    // date.
    let failures: WatchConfigLinkFailure[] = [];
    const item = this.libraryItem;
    const running = saveWatchMenusDraft(draft, item !== undefined ? { prepare: scrubWatchMenuOrphanTriggers, ...libraryItemIO(hass, this.lib.store, item) } : {
      prepare: scrubWatchMenuOrphanTriggers,
      save: (base, document) => saveWatchConfig(hass, watchId, "menus", base, document).then((reply) => {
        failures = linkFailuresOf(reply);
        return reply;
      }, (err: unknown) => {
        throw flatError(err);
      }),
      fetch: async () => {
        const record = await fetchWatchConfig(hass, watchId, "menus").catch((err: unknown) => {
          throw flatError(err);
        });
        return { revision: record.revision, document: record.document };
      },
    });
    this.followedSave = draft.saveDone;
    this.requestUpdate();
    const result = await running.catch((err: unknown) => ({
      ok: false,
      revision: draft.revision,
      merged: false,
      code: errCode(err) ?? "unknown",
      message: errText(err),
    }));
    this.saveEnded(watchId);
    const note = firstSaveNote(first, result.code, watchMenusSaveNote(result));
    return result.ok ? withLinkFailures(note, failures, "menus") : note;
  }

  /** Save the page draft as the page editor does (`page-editor.ts`
   * `save()`): the same tidying before each send, the same record. The note
   * for how it ended, or none. The pages are read again when it ends
   * (`pagesSaveEnded`). */
  private async savePages(hass: HassLike, watchId: string, draft: WatchPagesDraft): Promise<Note | undefined> {
    const running = saveWatchPagesDraft(draft, {
      // A hold and slide direction left on Trigger entity with nothing
      // picked is saved as None, and every `all` rule of a smart page the
      // draft changed is resolved from Home Assistant's states at the send.
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
    this.followedPagesSave = draft.saveDone;
    this.requestUpdate();
    const result = await running.catch((err: unknown) => ({
      ok: false,
      revision: draft.revision,
      merged: false,
      code: errCode(err) ?? "unknown",
      message: errText(err),
    }));
    this.pagesSaveEnded(watchId);
    return watchPagesSaveNote(result);
  }

  /** "Start fresh instead", asked first: while an iPhone may still move the
   * menus here, open the same ready screen a watch without one opens on, the
   * defaults unsaved. Nothing is written until Save. */
  private startFresh(): void {
    const watchId = this.watchId;
    if (watchId === undefined || !mayStart(this.noRecordState())) return;
    chooseStartFresh("menus", watchId);
    this.note = undefined;
    this.requestUpdate();
  }

  // ── the library: the menu's name, Used by, Make a copy ─────────────────

  /** Every device a menu can be used by (`watch-pages/devices.ts`): the Watch app's
   * devices, the watches and, on a home that keeps phone pages, the
   * iPhones, which have menus too. */
  private get linkDevices(): LinkDevice[] {
    return linkDevicesOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []), this.phones);
  }

  private get linkKind(): LinkDevice["kind"] {
    return this.device === "iphone" ? "iphone" : "watch";
  }

  /** The library menu this device uses for the section's unit: none before
   * the library is read, on an integration older than it, and while Home
   * Assistant holds no menus for the device. */
  private libraryMenuOf(menu: MenusSection): LibraryMenu | undefined {
    const lib = this.lib.library;
    // In library mode: the menu open, for its own unit's rows.
    const item = this.libraryItem;
    if (item !== undefined) {
      const open = lib === undefined ? undefined : libraryMenu(lib, item.id);
      return open?.unit === menuUnitOf(menu) ? open : undefined;
    }
    const watchId = this.watchId;
    if (lib === undefined || watchId === undefined || this.unsupported || (this.record?.revision ?? 0) <= 0) return undefined;
    return menuFor(lib, watchId, menuUnitOf(menu));
  }

  /** The badge on a menu's row in the Menus card: the menu's own name, when
   * it has one ("Home menu"). */
  private menuBadge(menu: MenusSection): string | undefined {
    if (menu === "switcher") return undefined;
    const used = this.libraryMenuOf(menu);
    return used === undefined || used.name === MENU_UNIT_TITLES[used.unit] ? undefined : used.name;
  }

  /** The name field as typed: sent as a rename once typing stops. */
  private typeMenuName(menuId: string, value: string): void {
    this.naming = { menuId, value };
    if (this.renameTimer !== undefined) clearTimeout(this.renameTimer);
    this.renameTimer = setTimeout(() => this.flushRename(), MENU_RENAME_MS);
  }

  /**
   * Send the typed name (`library/menus/rename`), trimmed. An empty name is
   * not sent: the field shows the menu's name again. The typed name stays
   * on screen until the library is read again after the rename, so the
   * field never flickers back to the old one.
   */
  private flushRename(): void {
    if (this.renameTimer !== undefined) clearTimeout(this.renameTimer);
    this.renameTimer = undefined;
    const naming = this.naming;
    if (naming === undefined || naming.sent === true) return;
    const store = this.lib.store;
    const lib = this.lib.library;
    const name = naming.value.trim();
    const menu = lib === undefined ? undefined : lib.index.menus.get(naming.menuId.toUpperCase());
    if (store === undefined || name === "" || menu === undefined || menu.name === name) {
      this.naming = undefined;
      return;
    }
    const sent: MenuNaming = { menuId: naming.menuId, value: name, sent: true };
    this.naming = sent;
    void store.renameMenu(naming.menuId, name).then(() => {
      if (this.naming === sent) this.naming = undefined;
    });
  }

  /** Let go of the typed name unsent. */
  private cancelRename(): void {
    if (this.renameTimer !== undefined) clearTimeout(this.renameTimer);
    this.renameTimer = undefined;
    this.naming = undefined;
  }

  /**
   * "Make a copy for this watch" (`library/menus/copy`): a new menu with
   * the slots of the one shown, named "<device>'s menu", which this device
   * uses from now on; the other devices keep the one they had. Made from the
   * menu as saved, so not over unsaved edits. The copy then shows here.
   */
  private async makeCopy(menu: LibraryMenu): Promise<void> {
    const store = this.lib.store;
    const watchId = this.watchId;
    if (store === undefined || watchId === undefined || this.copying || this.saving || (this.draft?.dirty ?? false)) return;
    this.flushRename();
    const here = this.linkDevices.find((d) => sameId(d.ownerId, watchId));
    const name = copyMenuName(here?.name ?? `This ${deviceNoun(this.device)}`);
    this.copying = true;
    this.libNote = undefined;
    const result = await store.copyMenu(watchId, menu.unit, name);
    this.copying = false;
    if (watchId !== this.watchId) return;
    this.libNote = result.ok ? { kind: "ok", text: copiedMenuText(name, this.linkKind) } : { kind: "err", text: `Not copied. ${result.text}` };
    if (result.ok) void this.load(watchId, true);
  }

  /** Why another device's tick cannot be clicked now: its menus editor in
   * this tab holds unsaved edits, which would land on this menu. */
  private menuTickLocked(ownerId: string): string | undefined {
    const watchId = this.watchId;
    // In library mode no device is "here": the preview device ticks as any.
    const here = this.libraryItem === undefined && (watchId === undefined || sameId(ownerId, watchId));
    if (here || !(keptWatchMenusDraft(ownerId)?.dirty ?? false)) return undefined;
    return dirtyElsewhereText(this.linkDevices.find((d) => sameId(d.ownerId, ownerId))?.name ?? "that device");
  }

  /**
   * The foot of a menu's row in the Menus card (Jesse, 2026-10-17: with the
   * menu, not in the inspector, so a copy is made right there): the menu's
   * name (a library menu has one, "Home menu") and, for a menu other devices
   * use too, "Make a copy for this watch". The devices that use it are in
   * the strip under the canvas head (`renderStageDevices`), as in every
   * editor. Clicks in it stop at the row, which picks the menu on a click.
   * Nothing before the library is read.
   */
  private libraryHead(menu: MenusSection): TemplateResult | typeof nothing {
    const used = this.libraryMenuOf(menu);
    const store = this.lib.store;
    const watchId = this.libraryItem === undefined ? this.watchId : this.recordKey;
    if (used === undefined || store === undefined || watchId === undefined) return nothing;
    const inLibrary = this.libraryItem !== undefined;
    const title = MENU_UNIT_TITLES[used.unit];
    const naming = this.naming !== undefined && sameId(this.naming.menuId, used.id) ? this.naming : undefined;
    const devices = this.linkDevices;
    const others = used.owners.filter((o) => !sameId(o, watchId));
    const word = deviceNoun(this.device);
    const copyBlocked = this.saving ? "Saving…" : (this.draft?.dirty ?? false) ? copyBlockedText(this.linkKind) : undefined;
    const note = store.noteFor("menus", used.id);
    return html`<div class="me-lib" role="group" aria-label=${title} @click=${(e: Event) => e.stopPropagation()}>
      <label class="me-lib-name"><span class="me-lib-h">Name</span>
        <input type="text" class="me-lib-input" aria-label=${`${title} name`} placeholder=${title} maxlength="80"
          .value=${live(naming?.value ?? used.name)}
          @input=${(e: InputEvent) => this.typeMenuName(used.id, (e.target as HTMLInputElement).value)}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter") { e.preventDefault(); this.flushRename(); }
            else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); this.cancelRename(); }
          }}
          @blur=${() => this.flushRename()} />
      </label>
      ${inLibrary ? this.renderLibraryDelete(used) : others.length === 0 ? nothing : html`<div class="me-lib-copy">
        <span class="me-lib-hint">An edit here changes it on ${joinWords(ownerWords(others, devices))} too.</span>
        <button type="button" class="pe-btn me-copy" ?disabled=${copyBlocked !== undefined || this.copying}
          title=${copyBlocked ?? `A copy of this menu that only this ${word} uses. The other devices keep this one.`}
          @click=${() => void this.makeCopy(used)}>${this.copying ? "Copying…" : `Make a copy for this ${word}`}</button>
      </div>`}
      ${note === undefined ? nothing : html`<p class="me-lib-note err" role="alert">${note}</p>`}
      ${this.libNote === undefined ? nothing : html`<p class="me-lib-note ${this.libNote.kind}" role="status">${this.libNote.text}</p>`}
    </div>`;
  }

  /** The menu's tick row: Used by with a round tick per device (a device
   * uses one menu of each kind, so a tick moves that device to this menu;
   * the ticked ones cannot be unticked). In the strip under the canvas head
   * the question and the count say it, so the row's own words are left off
   * there. */
  private menuTicks(used: LibraryMenu, inBar = false): TemplateResult {
    const store = this.lib.store!;
    const admin = this.hass?.user?.is_admin;
    return renderTicks({
      library: this.lib.library!,
      kind: "menus",
      itemId: used.id,
      devices: this.linkDevices,
      colorOf: (ownerId) => this.colorOf(ownerId),
      pending: store.pending,
      ...(admin === undefined ? {} : { admin }),
      ...(inBar ? { hint: false as const } : {}),
      locked: (ownerId) => this.menuTickLocked(ownerId),
    }, (ownerId) => { void store.pickMenu(ownerId, used.unit, used.id); });
  }

  /** The shown menu's devices, in the strip under the canvas head where
   * every editor has them: how many devices use the menu, then its round
   * ticks. Nothing before the library or the menus are read, and, on a
   * device, with no other device to move to it. */
  private renderStageDevices(host: MenusViewHost): TemplateResult | typeof nothing {
    const item = this.libraryItem;
    const lib = this.lib.library;
    let used: LibraryMenu | undefined;
    if (item !== undefined) {
      used = lib === undefined ? undefined : libraryMenu(lib, item.id);
    } else {
      used = this.linkDevices.length > 1 ? this.libraryMenuOf(shownMenu(host)) : undefined;
    }
    if (used === undefined || this.lib.store === undefined || this.draft === undefined) return nothing;
    return renderBarDevices("menus", used.owners.length, this.menuTicks(used, true), "stage");
  }

  /** Library mode's Delete from the library, for a menu no device uses (a
   * menu in use is refused `in_use`, so it is not offered): asked first,
   * then the way is back to the Menus tab. */
  private renderLibraryDelete(menu: LibraryMenu): TemplateResult | typeof nothing {
    if (menu.owners.length > 0) {
      return html`<p class="me-lib-hint">A save changes it on every device that uses it. To delete it, pick another menu for each of them first.</p>`;
    }
    if (!this.menuDeleteAsk) {
      return html`<button type="button" class="pe-btn pe-danger me-lib-del" ?disabled=${this.saving}
        title=${`Delete ${menu.name} from the library`} @click=${() => { this.menuDeleteAsk = true; }}>Delete from the library</button>`;
    }
    return html`<div class="me-lib-copy me-lib-del-ask" role="alertdialog" aria-label=${`Delete ${menu.name}?`}>
      <span class="me-lib-hint"><b>Delete ${menu.name}?</b> No device uses it. This cannot be undone.</span>
      <button type="button" class="pe-btn pe-danger" @click=${() => void this.deleteLibraryMenu(menu)}>Really delete</button>
      <button type="button" class="pe-btn" @click=${() => { this.menuDeleteAsk = false; }}>Cancel</button>
    </div>`;
  }

  private async deleteLibraryMenu(menu: LibraryMenu): Promise<void> {
    const store = this.lib.store;
    const key = this.recordKey;
    if (store === undefined || key === undefined || this.libraryItem === undefined) return;
    this.menuDeleteAsk = false;
    const result = await store.deleteItem("menus", menu.id);
    if (key !== this.recordKey) return;
    if (!result.ok) {
      this.libNote = { kind: "err", text: `Not deleted. ${result.text}` };
      return;
    }
    forgetWatchMenusDraft(key);
    this.onBack?.();
  }

  // ── restore ────────────────────────────────────────────────────────────

  private closeAsk(): void {
    this.renderRoot?.querySelector<HTMLDialogElement>("dialog.pe-ask")?.close();
    this.restoreAsk = undefined;
  }

  private askRestore(entry: WatchConfigHistoryEntry): void {
    const hass = this.hass;
    const watchId = this.watchId;
    const record = this.record;
    if (!hass || watchId === undefined || record === undefined || this.draft?.dirty) return;
    const ask: RestoreAsk = { entry, baseRevision: record.revision };
    this.restoreAsk = ask;
    fetchWatchConfigHistoryEntry(hass, watchId, "menus", entry.revision).then(
      (reply) => {
        if (this.restoreAsk !== ask) return;
        // A restore is a save of this device's menus: a menu it changes
        // changes on every device that uses that menu too.
        const links = menuRestoreLines(this.lib.library, watchId, record.document, reply.document, this.linkDevices);
        this.restoreAsk = { ...ask, summary: watchMenusSummary(reply.document), links };
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
      const reply = await restoreWatchConfig(hass, watchId, "menus", ask.entry.revision, ask.baseRevision);
      note = withLinkFailures({ kind: "ok", text: restoredText(ask.entry.updated_at) }, linkFailuresOf(reply), "menus")!;
      if (watchId === this.watchId) this.restartDraft = { watchId, revision: reply.revision };
      else if (!(keptWatchMenusDraft(watchId)?.dirty ?? false)) forgetWatchMenusDraft(watchId);
    } catch (err) {
      const code = errCode(err);
      if (code === "conflict") note = { kind: "warn", text: "Not restored. The menus changed somewhere else, so the newest copy is shown." };
      else if (code === "no_record") note = { kind: "warn", text: `Not restored. Home Assistant no longer holds menus for this ${deviceNoun(this.device)}.` };
      else if (code === "not_found") note = { kind: "warn", text: "Not restored. That save is no longer kept." };
      else if (code === "unknown_command") {
        this.historyState = "unsupported";
        note = { kind: "warn", text: "This version of the integration cannot restore menus. Update it to restore an earlier save." };
      } else note = { kind: "err", text: `Could not restore: ${friendlyError(err)}` };
    } finally {
      this.restoring = false;
      if (this.restoreAsk === ask) this.closeAsk();
    }
    if (watchId !== this.watchId) return;
    this.note = note;
    void this.load(watchId, true);
  }

  // ── keys ───────────────────────────────────────────────────────────────

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.defaultPrevented) return;
    const path = e.composedPath();
    if (!path.includes(this) && !this.headBar.holds(path) && !nothingFocused()) return;
    if (this.renderRoot.querySelector("dialog[open]")) return;
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();
    if (mod && !e.altKey && key === "s") {
      e.preventDefault();
      void this.save();
      return;
    }
    if (e.key === "Escape" && this.topMenuOpen) {
      e.preventDefault();
      this.topMenuOpen = false;
      void this.updateComplete.then(() => this.headBar.query(this.renderRoot, ".wa-bar .tb-more")?.focus());
      return;
    }
    if (e.key === "Escape" && this.watchMenuOpen) {
      e.preventDefault();
      this.watchMenuOpen = false;
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(".wa-bar .me-watch-btn")?.focus());
      return;
    }
    if (isTextField(path[0])) return;
    if (mod && !e.altKey && key === "z") {
      e.preventDefault();
      if (e.shiftKey) this.redo();
      else this.undo();
      return;
    }
    if (e.ctrlKey && !e.metaKey && !e.altKey && key === "y") {
      e.preventDefault();
      this.redo();
      return;
    }
    // Escape lets go of the selected slot, back to the menu's own settings,
    // as it lets go of a tile in the page editor.
    if (e.key === "Escape" && !mod && !e.altKey) {
      const host = this.viewHost();
      if (host !== undefined && deselectMenuSlot(host)) e.preventDefault();
    }
  };

  /** A click on the stage that lands on nothing, the watch's black screen
   * or the ground around it, lets go of the selected slot (or the
   * switcher's picked page), back to the menu's own settings. A slot, an
   * add button, a picked page's label and the tool strip keep theirs. */
  private onStageClick = (e: MouseEvent): void => {
    const path = e.composedPath();
    const stage = path.indexOf(e.currentTarget as EventTarget);
    // Only what is inside the stage counts, not the cards around it.
    const inside = stage < 0 ? path : path.slice(0, stage);
    if (inside.some((n) => typeof (n as Partial<Element>).matches === "function" && (n as Element).matches(STAGE_KEEPS_SELECTION))) return;
    const host = this.viewHost();
    if (host !== undefined) deselectMenuSlot(host);
  };

  /** A press anywhere outside an open menu of the top bar (the ··· menu, the
   * watch picker) closes it. */
  private onWindowPointerDown = (e: PointerEvent): void => {
    if (!this.topMenuOpen && !this.watchMenuOpen) return;
    const path = e.composedPath();
    const within = (...names: string[]) => path.some((n) => n instanceof HTMLElement && names.some((c) => n.classList.contains(c)));
    if (this.topMenuOpen && !within("pe-top-menu")) this.topMenuOpen = false;
    if (this.watchMenuOpen && !within("me-watch-picker")) this.watchMenuOpen = false;
  };

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const watches = this.watches;
    const draft = this.draft;
    return html`
      <div class="pe-top">
        ${this.barHost === undefined ? this.renderTopBar(draft, watches) : nothing}
        ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${this.renderBody(watches)}
      ${this.restoreAsk ? this.renderRestoreAsk(this.restoreAsk) : nothing}
    `;
  }

  /** Whether the editor is one column: the measured width, or Home
   * Assistant saying it is a phone. Before the first measurement it is not. */
  private get stacked(): boolean {
    return this.narrow || (this.hostWidth > 0 && this.hostWidth <= ME_STACK_WIDTH);
  }

  /**
   * The top bar, the page editor's and the complication editor's: the way
   * back at the left; then the watch picker (with more than one watch),
   * where the stored copy has got to, the ··· menu, Save with when the copy
   * was saved, Pages, Watch settings and the help at the right. Undo and
   * Redo are in the canvas head. Two rows when stacked.
   */
  private renderTopBar(draft: WatchMenusDraft | undefined, watches: readonly OwnerSummary[]): TemplateResult {
    if (this.libraryItem !== undefined) return this.renderLibraryBar(draft, watches);
    const editing = draft !== undefined && !this.unsupported;
    // The pages count too: a page's switcher settings are edited here.
    const dirty = editing && this.dirty;
    const shell = this.shellOwnsWatch;
    return html`<div class="wa-bar ${this.barHost !== undefined ? "in-head" : this.stacked ? "stacked" : ""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${() => this.onHaMenu?.()}>${uiIcon("menu")}</button>` : nothing}
      ${shell ? nothing : html`<button class="tb-btn tb-back" title="Back to complications"
        @click=${() => (this.onBack ? this.onBack() : navigateWatchMenus(undefined, false))}>${uiIcon("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${shell ? nothing : this.renderWatchPicker(watches)}
      ${this.barHost !== undefined && editing ? renderHeadStatus({ newWatch: this.newWatch, dirty, saved: renderConfigSaved(this.record, undefined, this.device), device: this.device }) : nothing}
      ${this.renderSyncPill(editing ? draft : undefined)}
      ${this.renderTopMenu(editing ? draft : undefined)}
      ${editing ? html`<button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S). A save reaches the ${deviceNoun(this.device)} the next time it checks.` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
        ${this.barHost !== undefined ? nothing : html`<span class="tb-saved" title=${dirty ? "Unsaved changes" : ""}>${renderConfigSaved(this.record, undefined, this.device)}</span>
        ${renderSaveReason(saveBlockedText({ newWatch: this.newWatch, dirty, saving: this.saving }))}`}` : nothing}
      ${shell ? nothing : html`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${() => (this.onPages ? this.onPages() : navigatePagesFromMenus(undefined))}>${uiIcon("pages")}<span>Pages</span></button>`}
      ${this.barActions}
    </div>`;
  }

  /** Library mode's bar: back to the Menus tab, the Library tag, then the
   * ··· menu and Save. No delivery and no way to Pages: a save reaches every
   * device that uses the menu, each on its own. The devices that use it are
   * in the strip under the canvas head, Preview as in the tool strip over
   * the stage. */
  private renderLibraryBar(draft: WatchMenusDraft | undefined, watches: readonly OwnerSummary[]): TemplateResult {
    const editing = draft !== undefined;
    const dirty = editing && this.dirty;
    return html`<div class="wa-bar ${this.stacked ? "stacked" : ""}" role="toolbar" aria-label="Menu in the library">
      ${this.haMenu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${() => this.onHaMenu?.()}>${uiIcon("menu")}</button>` : nothing}
      <button class="tb-btn tb-back" title="Back to the Menus tab" @click=${() => this.onBack?.()}>${uiIcon("left")}<span>Menus</span></button>
      ${renderLibraryTag()}
      <span class="spacer"></span>
      ${this.renderTopMenu(editing ? draft : undefined)}
      ${editing ? html`<button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S). A save reaches every device that uses this menu.` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>` : nothing}
      ${this.barActions}
    </div>`;
  }

  /** Where the stored copy has got to, as the complication editor's sync
   * pill: green once a device collected it, amber otherwise. The same facts
   * as the foot bar's line (`configFootStatus`). */
  private renderSyncPill(draft: WatchMenusDraft | undefined): TemplateResult | typeof nothing {
    const record = this.record;
    if (record === undefined || record.revision <= 0 || this.unsupported) return nothing;
    const budget = draft === undefined ? { size: 0, limit: 1 } : watchMenusBudget(draft.document);
    const status = configFootStatus({ record, size: budget.size, limit: budget.limit, noun: "menus", historyState: this.historyState, device: this.device });
    return html`<span class="tb-sync ${status.tone === "ok" ? "ok" : "warn"}" title=${`${status.state}. ${status.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${status.state}</span>
    </span>`;
  }

  /** Whether this watch's iPhone may still move this kind here, so the
   * screen waits and "Start fresh instead" asks first (`noRecordStart`). */
  private noRecordState(watches: readonly OwnerSummary[] = this.watches): NoRecordStart {
    return noRecordStart(watches.find((w) => w.owner_watch_id === this.watchId));
  }

  /** With no menus here, whether the screen opens ready (`new-watch.ts`)
   * rather than wait for the iPhone. */
  private opensReady(watches: readonly OwnerSummary[] = this.watches): boolean {
    return opensReady(this.noRecordState(watches), "menus", this.watchId);
  }

  /** "Start fresh instead" applies: Home Assistant holds no menus for this
   * watch, the integration keeps them, and the screen waits for the iPhone. */
  private canStartFresh(): boolean {
    return this.watchId !== undefined && this.newWatch && !this.opensReady();
  }

  /** The ··· menu: Discard edits, and Start fresh instead while the screen
   * waits for the iPhone. */
  private renderTopMenu(draft: WatchMenusDraft | undefined): TemplateResult | typeof nothing {
    const start = this.canStartFresh();
    if (draft === undefined && !start) return nothing;
    const open = this.topMenuOpen;
    const run = (fn: () => void) => () => { this.topMenuOpen = false; fn(); };
    return html`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} aria-label="More actions" title="More"
        @click=${() => { this.topMenuOpen = !open; }}>···</button>
      ${open ? html`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${draft ? html`<button class="row" role="menuitem" ?disabled=${!this.dirty || this.saving}
          title=${this.newWatch ? "Go back to the defaults. Undo brings the edits back." : "Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${run(() => this.discard())}>Discard edits</button>` : nothing}
        ${start ? html`<button class="row" role="menuitem"
          @click=${run(() => this.startFresh())}>${START_FRESH_BUTTON}</button>` : nothing}
      </div>` : nothing}
    </span>`;
  }

  /** A watch's device color (`device-colors.ts`), for its glyph. */
  private colorOf(watchId: string): string | undefined {
    return deviceColor(deviceColors(this.owners.length > 0 ? this.owners : (this.ownList ?? [])), watchId);
  }

  /**
   * The watch picker, the complication editor's Browse picker: the shown
   * watch's glyph in its device's color, its name and a caret, opening a
   * menu of every watch with a check on the shown one. Drawn whenever there
   * is more than one watch, in every state of the body, so a watch with no
   * menus yet (only the empty card) can still be switched away from.
   */
  private renderWatchPicker(watches: readonly OwnerSummary[]): TemplateResult | typeof nothing {
    if (watches.length < 2) return nothing;
    const current = watches.find((w) => w.owner_watch_id === this.watchId);
    const open = this.watchMenuOpen;
    const glyph = (id: string | undefined) => {
      const color = id === undefined ? undefined : this.colorOf(id);
      return html`<span class="pe-chip-glyph" style=${color ? `--pe-person: ${color}` : nothing} aria-hidden="true">${uiIcon("watch")}</span>`;
    };
    return html`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
        title="Choose the watch whose menus are shown" @click=${() => { this.watchMenuOpen = !open; }}>
        ${glyph(current?.owner_watch_id)}<span class="tb-browse-l">${current ? watchName(current, watches) : "Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${uiIcon("chevron")}</span>
      </button>
      ${open ? html`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${watches.map((w) => {
          const on = w.owner_watch_id === this.watchId;
          return html`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${on ? "true" : "false"}
            @click=${() => { this.watchMenuOpen = false; if (!on) this.openWatch(w.owner_watch_id); }}>
            ${glyph(w.owner_watch_id)}<span class="me-watch-name">${watchName(w, watches)}</span>
            <span class="me-watch-check" aria-hidden="true">${on ? uiIcon("check") : nothing}</span>
          </button>`;
        })}
      </div>` : nothing}
    </span>`;
  }

  // ── the columns ────────────────────────────────────────────────────────

  /** The side widths the grid can afford right now. */
  private fittedColumns(): ColumnWidths {
    if (this.hostWidth > 0 && this.hostWidth <= ME_STACK_WIDTH) return this.columns;
    return fitColumnWidths(this.hostWidth - ME_GRID_CHROME, this.columns, ME_COLUMNS);
  }

  private renderGutter(side: "left" | "right"): TemplateResult {
    return html`<div class="gutter ${side}" role="separator" aria-orientation="vertical"
      aria-label=${side === "left" ? "Resize the menus and slots column" : "Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${(e: PointerEvent) => {
        // Drag from the width on screen, not the stored preference.
        const shown = this.fittedColumns();
        beginColumnDrag(e, {
          side,
          base: side === "left" ? shown.left : shown.right,
          limits: ME_COLUMNS,
          onWidth: (width) => { this.columns = { ...this.columns, [side]: width }; },
          onEnd: () => saveColumnWidths(ME_COLUMNS_KEY, this.columns),
        });
      }}
      @dblclick=${() => {
        this.columns = { ...this.columns, [side]: ME_COLUMNS_DEFAULT[side] };
        saveColumnWidths(ME_COLUMNS_KEY, this.columns);
      }}></div>`;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  /** The stage's scale now: as stepped, else the page editor's fit for the
   * width. */
  private get stageScale(): number {
    return this.zoom ?? stageFitZoom(this.narrow || this.stacked);
  }

  private setZoom(scale: number | undefined): void {
    this.zoom = scale;
    saveMenusZoom(scale);
  }

  /**
   * The canvas card: the head (the shown menu's name, the watch's name as
   * text (the picker that changes it is in the top bar), the menu's facts
   * and the watch's size, then Undo and Redo), the strip of devices that
   * use the shown menu, the dotted stage
   * with the floating tool strip over the watch, and the hint under it.
   * Menus have no live state, so there is no Live strip.
   */
  private renderStage(host: MenusViewHost, watches: readonly OwnerSummary[]): TemplateResult {
    const owner = watches.find((w) => w.owner_watch_id === this.watchId);
    const found = caseForScreenSize(owner?.screen_size);
    const watchCase = found ?? REFERENCE_CASE;
    const caseLabel = host.phone === undefined ? watchCase.label : host.phone.model.label;
    const facts = [...menuStageFacts(host), caseLabel];
    // The pages' steps while a page is picked in the switcher, as the keys.
    const draft = this.undoDraft;
    const name = menuSectionLabel(shownMenu(host));
    return html`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${name}>${name}</span>
        ${owner !== undefined ? html`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${watchName(owner, watches)}</span></span>` : nothing}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${host.phone !== undefined ? PHONE_SIZE_TEXT : found === undefined ? `${watchCase.label}, this watch's size is not known` : facts.join(" · ")}><span class="fam">${facts.join(" · ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!draft?.canUndo} title=${`Undo (${MOD}Z)`} aria-label="Undo"
            @click=${() => this.undo()}>${uiIcon("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!draft?.canRedo} title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${() => this.redo()}>${uiIcon("redo")}</button>
        </span>
      </div>
      ${this.renderStageDevices(host)}
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(host)}
        ${renderMenuHowTo(host)}
        ${renderMenuStage(host)}
        <div class="under"><span class="tail">${menuStageHint(host)}</span>${renderMenuStageFoot(host)}</div>
      </div>
    </div>`;
  }

  /** The floating tool strip over the stage, the page editor's: the shown
   * menu's Add and Play opening (`menu-stage.ts`), Preview on in library
   * mode, and the zoom. The device's size is in the head over the stage. */
  private renderStageTools(host: MenusViewHost): TemplateResult {
    const phone = host.phone !== undefined;
    const scale = this.stageScale;
    const fit = stageFitZoom(this.narrow || this.stacked);
    // The percent is of the device's own points.
    const shownAs = (zoom: number): string => stageZoomLabel(phone ? zoom * PHONE_STAGE_ZOOM : zoom);
    return html`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${renderMenuStageTools(host)}
      ${this.libraryItem === undefined ? nothing : html`${renderPreviewPicker(this.previewKind, (kind) => this.pickPreview(kind))}<span class="tb-sep" aria-hidden="true"></span>`}
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${scale <= stageZoomOut(scale)} aria-label="Zoom out" title="Zoom out"
          @click=${() => this.setZoom(stageZoomOut(scale))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${shownAs(scale)}. Back to fit`}
          title=${`The ${phone ? "iPhone" : "watch"} at ${shownAs(scale)} of its own points. Click to fit it again (${shownAs(fit)}).`}
          @click=${() => this.setZoom(undefined)}>${shownAs(scale)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${scale >= stageZoomIn(scale)} aria-label="Zoom in" title="Zoom in"
          @click=${() => this.setZoom(stageZoomIn(scale))}>+</button>
      </span>
    </div>`;
  }

  private renderBody(watches: readonly OwnerSummary[]): TemplateResult {
    const inLibrary = this.libraryItem !== undefined;
    if (watches.length === 0 && !inLibrary) {
      const waiting = this.owners.length === 0 && this.ownList === undefined;
      return html`<div class="pe-empty">${waiting ? "Loading…" : "No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`;
    }
    if (this.unsupported) return html`<div class="pe-empty"><b>${WATCH_MENUS_UPDATE_TEXT}</b></div>`;
    if (this.loading) return html`<div class="pe-empty">Loading…</div>`;
    // Library mode draws only the menu's own unit, which the summary names.
    if (inLibrary && this.loadError === undefined && this.libraryUnit === undefined) {
      const failed = this.lib.readState === "failed" ? this.lib.store?.readError : undefined;
      return html`<div class="pe-empty">${failed ?? "Loading…"}</div>`;
    }
    if (this.loadError !== undefined) {
      const id = this.recordKey;
      return html`<div class="pe-empty">
        <span>${inLibrary ? "Could not read this menu" : `Could not read this ${deviceNoun(this.device)}'s menus`}: ${this.loadError}</span>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => void this.load(id)}>Try again</button>`}
      </div>`;
    }
    const record = this.record;
    if (record === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const draft = this.draft;
    // A record this panel cannot read, such as one from a newer schema.
    if (draft === undefined && record.revision > 0) return html`<div class="pe-empty"><b>${WATCH_MENUS_UPDATE_TEXT}</b></div>`;
    if (draft === undefined) {
      const kept = this.watchId === undefined ? undefined : keptWatchMenusDraft(this.watchId);
      const id = this.watchId;
      // No menus here and the screen does not open ready: the iPhone's move
      // may still come, so it waits, and "Start fresh instead" is a small
      // link that asks first.
      return html`<div class="pe-empty"><b>${noRecordTitle("menus", this.device)}</b><span>${WAIT_FOR_IPHONE_TEXT}</span>
        <button class="link start-fresh" @click=${() => this.startFresh()}>${START_FRESH_BUTTON}</button>
        ${kept?.dirty && id !== undefined ? html`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${() => { forgetWatchMenusDraft(id); this.requestUpdate(); }}>Discard the kept edits</button>` : nothing}
      </div>`;
    }
    const host = this.viewHost();
    if (host === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const fit = this.fittedColumns();
    const view = this.hostHeight > 0 ? `--pe-view-h:${this.hostHeight}px;` : "";
    // The complication editor's three columns (`editor-chrome.ts`), as the
    // page editor lays them out: the Menus and Slots cards, the canvas card,
    // and the inspector, with a drag gutter between each pair. The editor
    // scrolls as a whole and the side columns stick under the top bar.
    const fresh = record.revision <= 0;
    return html`${fresh && this.barHost === undefined ? renderNewWatchBanner(this.device) : nothing}
    <div class="layout pe-layout ${this.stacked ? "cols-1" : "cols-3"}" style=${`--wa-left:${fit.left}px;--wa-right:${fit.right}px;${view}`}>
      <div class="column left">
        ${renderMenusCard(host)}
        ${renderSlotsCard(host)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(host, watches)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${renderMenuInspector(host)}
      </div>
    </div>
    ${fresh || inLibrary ? nothing : this.renderFoot(record, draft.document, draft.dirty)}`;
  }

  /** The stored copy's line, History and Raw configuration, pinned to the
   * foot of the editor (`config-foot.ts`), with the two dialogs they open. */
  private renderFoot(record: WatchConfigRecord, document: MenusDocument, dirty: boolean): TemplateResult {
    const budget = watchMenusBudget(document);
    const status = configFootStatus({ record, size: budget.size, limit: budget.limit, noun: "menus", historyState: this.historyState, device: this.device });
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
      noun: "menus",
      device: this.device,
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
      noun: "menus",
      document,
      revision: record.revision,
      dirty,
      copied: this.rawCopied,
      onCopy: (text) => { void copyConfigText(text).then((ok) => { this.rawCopied = ok; }); },
      onClosed: () => { this.rawOpen = false; },
    }) : nothing}`;
  }

  private renderRestoreAsk(ask: RestoreAsk): TemplateResult {
    const record = this.record;
    const when = ago(ask.entry.updated_at);
    return html`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${(e: Event) => { if (this.restoring) e.preventDefault(); }}
      @close=${() => { this.restoreAsk = undefined; }}>
      <h3 id="me-ask-title">Restore revision ${ask.entry.revision}?</h3>
      <p>${savedByLine(ask.entry.updated_by, this.device)}${when ? ` ${when}` : ""}, ${kb(ask.entry.size)}.</p>
      ${ask.summary ? html`<p class="pe-muted">${ask.summary}</p>` : nothing}
      <p>It is saved again as a new revision${record ? `, after revision ${record.revision}` : ""}. The copy shown now stays in the earlier saves.</p>
      ${(ask.links ?? []).map((line) => html`<p>${line}</p>`)}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${() => void this.restore()}>${this.restoring ? "Restoring…" : "Restore"}</button>
      </div>
    </dialog>`;
  }

  static override styles = [formStyles, chromeTokens, topBarStyles, columnStyles, leftCardStyles, rowListStyles, canvasStyles, inspectorStyles, watchFrameStyles, phoneFrameStyles, newWatchStyles, css`
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
      /* A field brought into view lands under the sticky top. */
      scroll-padding-top: var(--pe-top-h, 0px);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }

    /* The top bar, and a note under it while there is one, stay at the top
       of the editor, as in the page editor: one block, sticky to the host's
       top edge and edge to edge as the foot bar is at the bottom, on the
       host's own background so the editor scrolls under it. Above the cards
       and their menus; the dialogs are modal, in the top layer, above it.
       Its measured height is --pe-top-h on the host (measureTop), which the
       sticky side columns stand under. */
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    /* The browser's own monospace, not the shared sheet's family. */
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }

    /* The bar's buttons with a glyph and words (the way back, Pages, the
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

    /* The complication editor's three columns (editor-chrome.ts), laid out
       as the page editor lays them: the editor scrolls as a whole, the stage
       with it, and the side widths come in as custom properties already
       fitted to the measured host width (fitColumnWidths). */
    .layout.pe-layout {
      flex: none; min-height: auto; overflow: visible; align-items: start; padding: 0;
      /* The room above the foot bar. */
      margin-bottom: 14px;
    }
    /* The Menus and Slots cards and the inspector stay in view while the
       editor scrolls: each sticks just under the sticky top block (the
       host's scroll box, inside its padding, starts --cf-pad down; the block
       reaches --pe-top-h down from the edge) and, when taller than the room
       left, scrolls on its own. --pe-view-h is the host's measured content
       height, less what the top block covers past the padding, what the foot
       bar covers and a little air. */
    .pe-layout > .column.left, .pe-layout > .column.inspector {
      --pe-under-top: max(0px, calc(var(--pe-top-h, 0px) - var(--cf-pad, 16px)));
      position: sticky; top: var(--pe-under-top);
      max-height: calc(var(--pe-view-h, calc(100dvh - 120px)) - 30px - var(--pe-under-top));
      overflow-y: auto; overflow-x: hidden;
    }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout > .column.left > .card { flex: none; }
    .pe-layout > .column.canvas { overflow: visible; min-height: auto; }
    /* One column under 820px, the complication editor's order: the menu on
       the watch, the settings, then the lists. */
    @container (max-width: 820px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      /* As strong as the sticky rule, so a stacked list or inspector stops
         sliding over the cards above it (the page editor's fix). */
      .pe-layout > .column.left, .pe-layout > .column.canvas, .pe-layout > .column.inspector { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }

    /* The canvas card: the head, the dotted stage and its tool strip. The
       stage is the watch at a set scale, not a fitted box: it grows with
       the zoom and the editor scrolls. */
    .column.canvas > .card.canvas-card.me-canvas { min-height: 0; flex: none; }
    /* The lit stage's edge in Menus' hue, Home's Menus door. */
    .canvas-card.me-canvas { --wa-stage-hue: var(--wa-hue-orange); }
    /* The shown menu's name: read, not typed. */
    .cv-head .cv-title { flex: 0 1 auto; min-width: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* The shown watch's name in the head: a fact; the picker is in the bar. */
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* The watch picker, the complication editor's Browse picker: its glyph
       in the watch's device color, the name, a caret; the menu lists every
       watch with a check on the shown one. */
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.me-watch-btn { max-width: 260px; }
    .me-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .me-watch-btn .me-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.me-watch-btn .me-caret svg { width: 11px; height: 11px; }
    .pop-menu.me-watch-menu { left: 0; right: auto; min-width: 220px; }
    .me-watch-menu .row.me-watch-row { display: flex; align-items: center; gap: 8px; }
    .me-watch-row .me-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .me-watch-row[aria-checked="true"] { font-weight: 700; }
    .me-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .me-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .me-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .me-stage-area { padding-top: 92px; }
    }
    /* The picture keeps its size and the stage scrolls sideways under it on
       a screen narrower than the watch drawn at this scale. */
    .me-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .me-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
    /* The watch's size is a fact, not a menu. */

    .pe-badge {
      display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
      color: var(--wa-muted); background: var(--wa-field); white-space: nowrap;
    }

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
    .pe-btn.pe-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.pe-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    /* Not "primary" and "danger": the shared sheet's button.primary and
       button.danger outrank .pe-btn and would restyle these. */
    .pe-btn.pe-danger { color: var(--wa-need); align-self: flex-start; }

    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    dialog.pe-ask p.pe-muted { font-size: 13px; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }

    :host([narrow]) { --cf-pad: 12px; }

    /* The foot of a menu's row in the Menus card: the menu's name and Make
       a copy for this watch (libraryHead). */
    .me-lib { display: flex; flex-direction: column; gap: 8px; padding: 0; font-weight: 400; }
    .me-lib-name { max-width: 420px; }
    .me-lib-name { display: flex; flex-direction: column; gap: 4px; }
    .me-lib-h { font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
    .me-lib-input {
      min-height: 32px; padding: 0 10px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-input, var(--wa-field)); color: var(--wa-ink); font: inherit; font-size: 13.5px; font-weight: 600;
    }
    .me-lib-input:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .me-lib-copy { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
    .me-lib-hint { font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
    .me-lib-note { margin: 0; font-size: 12px; line-height: 1.35; color: var(--wa-muted); }
    .me-lib-note.err { color: var(--wa-need); }
    .me-lib-note.ok { color: var(--wa-ink); }
  `, menuViewStyles, menuStageStyles, menuInspectorLookStyles, configFootStyles, howToStyles, libraryTicksStyles, libraryModeStyles, headBarStyles];
}

if (!customElements.get("wa-menu-editor")) {
  customElements.define("wa-menu-editor", WaMenuEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-menu-editor": WaMenuEditor;
  }
}
